const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const scrapeArticles = async () => {
    try {
        console.log('Starting scrape...');

        // Helper function to extract articles from a page
        const extractFromPage = async (pageNumber) => {
            const url = `https://beyondchats.com/blogs/page/${pageNumber}/`;
            console.log(`Fetching ${url}`);
            try {
                const { data } = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                const $ = cheerio.load(data);
                const pageArticles = [];

                $('article').each((index, element) => {
                    const titleElement = $(element).find('.entry-title a, h2 a, h3 a').first();
                    const title = titleElement.text().trim();
                    const url = titleElement.attr('href');

                    // improved selectors based on inspection
                    let date = $(element).find('.entry-date, .date, .ct-meta-element-date, time').text().trim();
                    if (!date) {
                        // try searching in meta list
                        date = $(element).find('.entry-meta').text().trim();
                    }

                    const description = $(element).find('.entry-excerpt, .entry-content, .ct-entry-excerpt, p').first().text().trim();
                    const imageUrl = $(element).find('.ct-media-container img, img').attr('src');

                    if (title && url) {
                        pageArticles.push({
                            title,
                            url,
                            description,
                            date,
                            imageUrl
                        });
                    }
                });
                return pageArticles;
            } catch (error) {
                console.error(`Error scraping page ${pageNumber}:`, error.message);
                return [];
            }
        };

        // 1. Fetch Page 15 (Last page)
        const page15Articles = await extractFromPage(15);

        // 2. Fetch Page 14 (Second to last page)
        const page14Articles = await extractFromPage(14);

        const allCandidates = [...page14Articles, ...page15Articles];

        // We want the 5 oldest.
        // Assuming P15 has the oldest, P14 has next oldest.
        // The articles on P15 are OLDER than P14.
        // So in terms of age:
        // P15 Item 1 (Oldest)
        // P14 Item N (Next Oldest) ... P14 Item 1 (Newer)
        // So we want: P15 Items + The "End" of P14 Items.

        // P15 items are at the END of the master list of all articles.
        // Master List: [Page 1 ... Page 14 ... Page 15]

        // So we just take the last 5 from the combined array (if valid order).
        // Let's assume order on page is New->Old.
        // P14: [Newer... Older]. P15: [Older... Oldest].
        // So the stream is P14 followed by P15.
        // Combined: [P14-1 ... P14-N, P15-1 ... P15-M].
        // The last 5 of this array are the 5 oldest.
        // [P14-Last4, P15-Last1] -> These are the 5 oldest.

        const oldestFive = allCandidates.slice(-5).reverse(); // Reverse to have Oldest First in our DB insertion order?
        // Or keep them Newest->Oldest?
        // Usually "Fetch 5 oldest" implies returning them.
        // I'll store them. The order in DB doesn't matter much as long as we have them.

        console.log(`Found ${oldestFive.length} articles to save.`);

        const savedArticles = [];
        for (const articleData of oldestFive) {
            const exists = await Article.findOne({ url: articleData.url });
            if (!exists) {
                const saved = await Article.create(articleData);
                savedArticles.push(saved);
                console.log(`Saved: ${articleData.title}`);
            } else {
                console.log(`Skipped (Exists): ${articleData.title}`);
                savedArticles.push(exists);
            }
        }

        return savedArticles;

    } catch (error) {
        console.error('Scraping failed:', error);
        throw error;
    }
};

module.exports = scrapeArticles;

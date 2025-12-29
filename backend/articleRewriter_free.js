const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config(); // Load environment variables from .env file

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/articles';
const GOOGLE_SEARCH_API = 'https://www.googleapis.com/customsearch/v1';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get these from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;
const GROQ_API_KEY = process.env.GROQ_API_KEY; // FREE API!

/**
 * Fetch all articles from the API
 */
async function fetchArticles() {
    try {
        console.log('Fetching articles from API...');
        const response = await axios.get(API_BASE_URL);
        console.log(`Found ${response.data.length} articles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        throw error;
    }
}

/**
 * Search Google for the article title
 */
async function searchGoogle(query) {
    try {
        console.log(`Searching Google for: "${query}"`);
        const response = await axios.get(GOOGLE_SEARCH_API, {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_SEARCH_ENGINE_ID,
                q: query,
                num: 5 // Get 5 results to filter for blogs/articles
            }
        });

        // Filter for blog/article URLs (exclude social media, videos, etc.)
        const results = response.data.items || [];
        const blogResults = results.filter(item => {
            const url = item.link.toLowerCase();
            return !url.includes('youtube.com') &&
                !url.includes('facebook.com') &&
                !url.includes('twitter.com') &&
                !url.includes('instagram.com');
        }).slice(0, 2); // Get first 2 blog/article results

        console.log(`Found ${blogResults.length} blog/article results`);
        return blogResults.map(item => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet
        }));
    } catch (error) {
        console.error('Error searching Google:', error.message);
        throw error;
    }
}

/**
 * Scrape main content from a URL
 */
async function scrapeArticleContent(url) {
    try {
        console.log(`Scraping content from: ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // Remove unwanted elements
        $('script, style, nav, header, footer, iframe, noscript').remove();

        // Try to find main content
        let content = '';
        const contentSelectors = [
            'article',
            '[role="main"]',
            'main',
            '.post-content',
            '.article-content',
            '.entry-content',
            '.content'
        ];

        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length > 0) {
                content = element.text().trim();
                break;
            }
        }

        // Fallback: get all paragraph text
        if (!content || content.length < 200) {
            content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
        }

        // Clean up the content
        content = content.replace(/\s+/g, ' ').trim();

        console.log(`Scraped ${content.length} characters from ${url}`);
        return content.substring(0, 3000); // Limit to 3000 chars to avoid token limits
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return '';
    }
}

/**
 * Call Groq API (FREE!) to rewrite the article
 */
async function rewriteArticleWithLLM(originalArticle, referenceArticles) {
    try {
        console.log('Calling FREE Groq LLM to rewrite article...');

        const prompt = `You are a content writer. Rewrite the following article to match the style and formatting of the reference articles provided.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.description || 'No content available'}

REFERENCE ARTICLE 1:
${referenceArticles[0]?.content || 'Not available'}

REFERENCE ARTICLE 2:
${referenceArticles[1]?.content || 'Not available'}

Instructions:
1. Rewrite the original article to match the style, tone, and formatting of the reference articles
2. Keep the core message of the original article
3. Make it engaging and well-formatted
4. Return ONLY the rewritten content without any additional commentary
5. Keep the content concise (around 500-800 words)`;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.3-70b-versatile', // FREE and FAST!
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional content writer who rewrites articles to match specific styles.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const rewrittenContent = response.data.choices[0].message.content;
        console.log('Article rewritten successfully');
        return rewrittenContent;
    } catch (error) {
        console.error('Error calling Groq API:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Add references to the article content
 */
function addReferences(content, references) {
    const referencesSection = '\n\n---\n\n**References:**\n\n' +
        references.map((ref, index) =>
            `${index + 1}. [${ref.title}](${ref.url})`
        ).join('\n');

    return content + referencesSection;
}

/**
 * Update article using the API
 */
async function updateArticle(articleId, updatedData) {
    try {
        console.log(`Updating article ${articleId}...`);
        const response = await axios.put(`${API_BASE_URL}/${articleId}`, updatedData);
        console.log('Article updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating article:', error.message);
        throw error;
    }
}

/**
 * Main function to process articles
 */
async function processArticles() {
    try {
        // Check if API keys are set
        if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID || !GROQ_API_KEY) {
            console.error('\n❌ Error: Missing API keys!');
            console.log('Please set the following environment variables:');
            console.log('- GOOGLE_API_KEY');
            console.log('- GOOGLE_SEARCH_ENGINE_ID');
            console.log('- GROQ_API_KEY (Get FREE at https://console.groq.com)');
            return;
        }

        console.log('\n🚀 Starting article rewriting process (using FREE Groq API)...\n');

        // 1. Fetch articles from API
        const articles = await fetchArticles();

        if (articles.length === 0) {
            console.log('No articles found to process');
            return;
        }

        // Process each article
        for (const article of articles) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`Processing: ${article.title}`);
            console.log('='.repeat(60));

            try {
                // 2. Search Google for the article title
                const searchResults = await searchGoogle(article.title);

                if (searchResults.length < 2) {
                    console.log('⚠️  Not enough search results found, skipping...');
                    continue;
                }

                // 3. Scrape content from the top 2 results
                const referenceArticles = [];
                for (const result of searchResults) {
                    const content = await scrapeArticleContent(result.url);
                    if (content) {
                        referenceArticles.push({
                            title: result.title,
                            url: result.url,
                            content: content
                        });
                    }
                }

                if (referenceArticles.length === 0) {
                    console.log('⚠️  Could not scrape any reference articles, skipping...');
                    continue;
                }

                // 4. Call LLM to rewrite the article
                const rewrittenContent = await rewriteArticleWithLLM(article, referenceArticles);

                // 5. Add references at the bottom
                const finalContent = addReferences(rewrittenContent, referenceArticles);

                // 6. Update the article via API
                await updateArticle(article._id, {
                    ...article,
                    description: finalContent
                });

                console.log('✅ Article processed successfully!\n');

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`❌ Error processing article "${article.title}":`, error.message);
                continue;
            }
        }

        console.log('\n✨ All articles processed!\n');

    } catch (error) {
        console.error('Fatal error:', error.message);
    }
}

// Run the script
if (require.main === module) {
    processArticles();
}

module.exports = { processArticles };

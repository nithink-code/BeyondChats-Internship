const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const run = () => {
    const html = fs.readFileSync('page15.html', 'utf8');
    const $ = cheerio.load(html);
    const article = $('article').first();
    console.log(article.html());
};

run();

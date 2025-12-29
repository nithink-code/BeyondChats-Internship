# Article Rewriter Script

This Node.js script automatically fetches articles from your API, searches Google for similar content, scrapes top-ranking articles, and uses AI to rewrite your articles to match the style of top-performing content.

## Features

1. ✅ Fetches articles from your existing CRUD API
2. ✅ Searches Google for each article's title
3. ✅ Scrapes content from the top 2 blog/article results
4. ✅ Uses OpenAI GPT to rewrite articles matching the style of top-ranking content
5. ✅ Adds references to scraped articles at the bottom
6. ✅ Updates articles using your CRUD API

## Prerequisites

Before running the script, you need to obtain the following API keys:

### 1. Google Custom Search API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Custom Search API"
4. Go to "Credentials" and create an API key
5. Copy your `GOOGLE_API_KEY`

### 2. Google Custom Search Engine ID

1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create a new search engine
3. In "Sites to search", enter `www.google.com`
4. Create the search engine
5. Go to "Edit search engine" → "Setup" → "Basics"
6. Copy your `Search engine ID` (this is your `GOOGLE_SEARCH_ENGINE_ID`)

### 3. OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy your `OPENAI_API_KEY`

## Setup

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   
   Add the following to your `.env` file:
   ```env
   # Google Custom Search API
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

1. **Start your API server** (in one terminal):
   ```bash
   npm start
   ```

2. **Run the article rewriter** (in another terminal):
   ```bash
   npm run rewrite
   ```

   Or directly:
   ```bash
   node articleRewriter.js
   ```

## How It Works

1. **Fetch Articles**: The script fetches all articles from `http://localhost:5000/api/articles`

2. **Google Search**: For each article, it searches Google using the article's title

3. **Scrape Content**: It scrapes the main content from the top 2 blog/article results (excluding social media sites)

4. **AI Rewriting**: Uses OpenAI GPT-3.5-turbo to rewrite the original article to match the style and formatting of the top-ranking articles

5. **Add References**: Appends a references section at the bottom with links to the scraped articles

6. **Update Article**: Updates the article in your database using the PUT API endpoint

## Output Example

After processing, your article will look like this:

```
[Rewritten article content matching the style of top-ranking articles]

---

**References:**

1. [Article Title 1](https://example.com/article1)
2. [Article Title 2](https://example.com/article2)
```

## Configuration

You can modify the following in `articleRewriter.js`:

- `API_BASE_URL`: Change if your API runs on a different port
- Content length limits in the `scrapeArticleContent` function
- LLM model (currently using `gpt-3.5-turbo`)
- Temperature and max_tokens for AI generation

## Error Handling

The script includes error handling for:
- Missing API keys
- Failed API requests
- Scraping failures
- Rate limiting (includes 2-second delays between articles)

If an article fails to process, the script will log the error and continue with the next article.

## Notes

- The script processes articles sequentially to avoid rate limiting
- Each article includes a 2-second delay between processing
- Scraped content is limited to 3000 characters to avoid token limits
- The script filters out social media links from Google search results
- Only blog/article URLs are processed

## Troubleshooting

**"Missing API keys" error:**
- Make sure all three API keys are set in your `.env` file

**"Error fetching articles":**
- Ensure your API server is running on port 5000
- Check that you have articles in your database

**"Error searching Google":**
- Verify your Google API key is valid
- Check that Custom Search API is enabled in Google Cloud Console
- Ensure you haven't exceeded your daily quota

**"Error calling LLM API":**
- Verify your OpenAI API key is valid
- Check that you have sufficient credits in your OpenAI account

## API Costs

- **Google Custom Search**: Free tier includes 100 searches/day
- **OpenAI GPT-3.5-turbo**: Approximately $0.002 per article (varies based on content length)

## License

ISC

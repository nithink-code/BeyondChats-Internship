require('dotenv').config();

/**
 * Test script to verify API keys and connections
 */
async function testSetup() {
    console.log('\n🔍 Testing Article Rewriter Setup...\n');
    console.log('1. Checking environment variables...');
    const requiredEnvVars = {
        'GOOGLE_API_KEY': process.env.GOOGLE_API_KEY,
        'GOOGLE_SEARCH_ENGINE_ID': process.env.GOOGLE_SEARCH_ENGINE_ID,
        'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
        'MONGODB_URI': process.env.MONGODB_URI
    };

    let allEnvVarsSet = true;
    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (value) {
            console.log(`   ✅ ${key}: Set`);
        } else {
            console.log(`   ❌ ${key}: Not set`);
            allEnvVarsSet = false;
        }
    }

    if (!allEnvVarsSet) {
        console.log('\n⚠️  Please set all required environment variables in .env file');
        console.log('   See .env.example for reference\n');
        return;
    }

    // Test API connection
    console.log('\n2. Testing API connection...');
    try {
        const axios = require('axios');
        const response = await axios.get('http://localhost:5000/api/articles');
        console.log(`   ✅ API is running - Found ${response.data.length} articles`);
    } catch (error) {
        console.log('   ❌ Cannot connect to API');
        console.log('   Make sure your server is running on port 5000');
        console.log('   Run: npm start\n');
        return;
    }

    // Test Google Search API
    console.log('\n3. Testing Google Search API...');
    try {
        const axios = require('axios');
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
                q: 'test',
                num: 1
            }
        });
        console.log('   ✅ Google Search API is working');
    } catch (error) {
        console.log('   ❌ Google Search API error:', error.response?.data?.error?.message || error.message);
        return;
    }

    // Test OpenAI API
    console.log('\n4. Testing OpenAI API...');
    try {
        const axios = require('axios');
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Say "test successful"' }],
                max_tokens: 10
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('   ✅ OpenAI API is working');
    } catch (error) {
        console.log('   ❌ OpenAI API error:', error.response?.data?.error?.message || error.message);
        return;
    }

    console.log('\n✨ All tests passed! You can now run the article rewriter.\n');
    console.log('   Run: npm run rewrite\n');
}

testSetup().catch(console.error);

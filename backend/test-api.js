const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config({ path: '.env' });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 60000,
});

async function testAPI() {
  console.log('🧪 Testing basic API connection...');
  console.log('API Key:', process.env.ANTHROPIC_API_KEY?.substring(0, 20) + '...');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say hello in one word'
        }
      ]
    });

    console.log('✅ SUCCESS! Response:', message.content);
    console.log('✅ Your API key works and can connect to Anthropic!');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();

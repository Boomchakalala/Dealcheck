import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 15));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: 'Say "Hello from OpenAI!"' }
      ],
      max_tokens: 20,
    });

    console.log('\n✅ SUCCESS! OpenAI API is working!');
    console.log('Response:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
      console.error('Type:', error.type);
    }
  }
}

test();

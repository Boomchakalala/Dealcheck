import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 10));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: 'Say "API works!"' }
      ],
      max_tokens: 10,
    });

    console.log('Success!');
    console.log('Response:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();

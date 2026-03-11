const fetch = require('node-fetch');

async function testCreateDeal() {
  try {
    const response = await fetch('http://localhost:3000/api/deal/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        extractedText: 'Test quote: $100/month for 12 months',
        dealType: 'New',
        goal: 'reduce price',
        notes: 'test',
        vendor: 'Test Vendor',
        saveExtractedText: false,
        isDemoText: false
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCreateDeal();

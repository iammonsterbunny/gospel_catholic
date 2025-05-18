// test-sinhala.js
const axios = require('axios');

/**
 * Test Google Translate API with Sinhala translation
 */
async function testSinhalaTranslation() {
  try {
    const textToTranslate = "Today's Gospel: Jesus said to his disciples, 'Peace I leave with you; my peace I give to you.'";
    console.log(`Original text: "${textToTranslate}"`);
    
    // Translate using Google Translate API
    const encodedText = encodeURIComponent(textToTranslate);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=si&dt=t&q=${encodedText}`;
    
    console.log('Sending request to Google Translate...');
    const response = await axios.get(url);
    
    // Process Google Translate response
    let translatedText = '';
    if (response.data && Array.isArray(response.data[0])) {
      response.data[0].forEach(segment => {
        if (segment[0]) {
          translatedText += segment[0];
        }
      });
    }
    
    console.log(`\nTranslated text (Sinhala): "${translatedText}"`);
    console.log('\nTranslation successful!');
    
    return { success: true, translation: translatedText };
  } catch (error) {
    console.error('Translation error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testSinhalaTranslation();
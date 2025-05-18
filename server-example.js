// server-example.js - A simple Express server using the gospel_catholic package
const express = require('express');
const GospelCatholic = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache system to avoid redundant API calls
const cache = {
  data: {},
  timestamp: null,
  expiryTime: 1000 * 60 * 60 * 3 // Cache expires after 3 hours
};

// Middleware to parse JSON requests
app.use(express.json());

// Get gospel in specified language
app.get('/gospel/:lang?', async (req, res) => {
  try {
    const language = req.params.lang || 'en';
    
    // Check if we have valid cached data
    const now = Date.now();
    const cacheValid = cache.timestamp && 
                      (now - cache.timestamp < cache.expiryTime) &&
                      cache.data[language];
    
    let gospelData;
    
    if (cacheValid) {
      console.log(`Using cached data for language: ${language}`);
      gospelData = cache.data[language];
    } else {
      console.log(`Fetching new data for language: ${language}`);
      const gospel = new GospelCatholic({ language });
      gospelData = await gospel.getGospel();
      
      // Update cache
      if (!cache.data) cache.data = {};
      cache.data[language] = gospelData;
      cache.timestamp = now;
    }
    
    res.json({
      success: true,
      date: gospelData.original.date,
      content: language === 'en' ? gospelData.original : gospelData.translated
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve gospel reading'
    });
  }
});

// Text-only version for simple bots
app.get('/gospel-text/:lang?', async (req, res) => {
  try {
    const language = req.params.lang || 'en';
    const gospel = new GospelCatholic({ language });
    const result = await gospel.getGospel();
    
    const content = language === 'en' ? result.original : result.translated;
    
    // Format response as plain text
    const textResponse = `${content.title}\n\n${result.original.date}\n\n${content.scripture}\n\n${content.text}`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(textResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: Failed to retrieve gospel reading');
  }
});

// Supported languages info
app.get('/supported-languages', (req, res) => {
  res.json({
    success: true,
    message: 'The gospel_catholic package supports all languages available in Google Translate',
    commonLanguages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }, 
      { code: 'fr', name: 'French' },
      { code: 'it', name: 'Italian' },
      { code: 'de', name: 'German' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'si', name: 'Sinhala' },
      // Many more supported...
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Gospel Catholic API running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/gospel/en`);
  console.log(`Or for Sinhala: http://localhost:${PORT}/gospel/si`);
});
// whatsapp-bot.js - WhatsApp bot implementation using whatsapp-web.js
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const GospelCatholic = require('./index');

// Caching system to reduce API calls
const gospelCache = {
  data: {},
  timestamp: null,
  expiryTime: 1000 * 60 * 60 * 6 // Cache expires after 6 hours
};

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Generate QR code for authentication
client.on('qr', (qr) => {
  console.log('QR RECEIVED, scan with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Ready event
client.on('ready', () => {
  console.log('Client is ready!');
  console.log('Gospel WhatsApp Bot is now running...');
  console.log('Commands:');
  console.log('!gospel - Get today\'s gospel in English');
  console.log('!gospel <language-code> - Get gospel in specified language (e.g., !gospel es)');
  console.log('!languages - List some supported language codes');
});

// Handle incoming messages
client.on('message', async (msg) => {
  const command = msg.body.toLowerCase();

  // Check if message is a gospel command
  if (command === '!gospel') {
    await handleGospelCommand(msg, 'en');
  } 
  // Check for language-specific gospel command
  else if (command.startsWith('!gospel ')) {
    const langCode = command.split(' ')[1];
    await handleGospelCommand(msg, langCode);
  }
  // List supported languages
  else if (command === '!languages') {
    await msg.reply(
      "*Supported Languages*\n\n" +
      "en - English\n" +
      "es - Spanish\n" +
      "fr - French\n" +
      "it - Italian\n" +
      "de - German\n" +
      "pt - Portuguese\n" +
      "si - Sinhala\n" +
      "ru - Russian\n" +
      "ar - Arabic\n" +
      "hi - Hindi\n" +
      "bn - Bengali\n" +
      "zh - Chinese\n" +
      "ja - Japanese\n" +
      "ko - Korean\n\n" +
      "And many more! Try with any language code."
    );
  }
});

// Handler for gospel commands
async function handleGospelCommand(msg, language) {
  try {
    await msg.reply(`⏳ Fetching today's gospel in ${language}...`);
    
    // Check cache first
    const now = Date.now();
    const cacheValid = gospelCache.timestamp && 
                     (now - gospelCache.timestamp < gospelCache.expiryTime) &&
                     gospelCache.data[language];
    
    let gospelData;
    
    if (cacheValid) {
      console.log(`Using cached gospel data for ${language}`);
      gospelData = gospelCache.data[language];
    } else {
      console.log(`Fetching new gospel data for ${language}`);
      const gospel = new GospelCatholic({ language });
      gospelData = await gospel.getGospel();
      
      // Update cache
      if (!gospelCache.data) gospelCache.data = {};
      gospelCache.data[language] = gospelData;
      gospelCache.timestamp = now;
    }
    
    // Whether to use original or translated content
    const content = language === 'en' ? gospelData.original : gospelData.translated;
    
    // Format message
    const gospelMessage = 
      `*${content.title}*\n\n` +
      `📅 ${gospelData.original.date}\n\n` +
      `📖 ${content.scripture}\n\n` +
      `${content.text}`;
    
    // Send the gospel message
    await msg.reply(gospelMessage);
    
  } catch (error) {
    console.error('Error handling gospel command:', error);
    await msg.reply('Sorry, I encountered an error while fetching the gospel reading. Please try again later.');
  }
}

// Initialize WhatsApp client
client.initialize();
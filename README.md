# gospel_catholic

An NPM package to fetch daily Catholic gospel readings from Vatican News with translation support. Useful for WhatsApp bots, Discord bots, Telegram bots, and more.

## Installation

```bash
npm install gospel_catholic
```

## Usage

### Basic Usage

```javascript
const GospelCatholic = require('gospel_catholic');

// Create a new instance with default settings (English)
const gospel = new GospelCatholic();

// Get today's gospel
gospel.getGospel()
  .then(result => {
    console.log('Gospel Title:', result.original.title);
    console.log('Date:', result.original.date);
    console.log('Scripture:', result.original.scripture);
    console.log('Gospel Text:', result.original.text);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### With Translation

```javascript
// Create a new instance with Spanish translation
const gospel = new GospelCatholic({ language: 'es' });

// Get today's gospel translated to Spanish
gospel.getGospel()
  .then(result => {
    console.log('Original Title:', result.original.title);
    console.log('Translated Title:', result.translated.title);
    console.log('Translated Scripture:', result.translated.scripture);
    console.log('Translated Gospel Text:', result.translated.text);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Supported Languages

The package supports all languages available in Google Translate, including:
- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `it` - Italian
- `de` - German
- `pt` - Portuguese
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi
- `bn` - Bengali
- `si` - Sinhala (supported with Google Translate)
- And many more ISO language codes

The package uses Google Translate's API which supports over 100 languages including those with less common support like Sinhala, Amharic, Kurdish, etc.

## Integration Examples

### WhatsApp Bot (using whatsapp-web.js)

```javascript
const { Client } = require('whatsapp-web.js');
const GospelCatholic = require('gospel_catholic');
const client = new Client();

client.on('message', async msg => {
  if (msg.body === '!gospel') {
    const gospel = new GospelCatholic();
    const result = await gospel.getGospel();
    
    msg.reply(`*${result.original.title}*\n${result.original.date}\n\n${result.original.scripture}\n\n${result.original.text}`);
  }
  
  if (msg.body === '!evangelio') {
    const gospel = new GospelCatholic({ language: 'es' });
    const result = await gospel.getGospel();
    
    msg.reply(`*${result.translated.title}*\n${result.original.date}\n\n${result.translated.scripture}\n\n${result.translated.text}`);
  }
});

client.initialize();
```

### Discord Bot (using discord.js)

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const GospelCatholic = require('gospel_catholic');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('messageCreate', async message => {
  if (message.content === '!gospel') {
    const gospel = new GospelCatholic();
    const result = await gospel.getGospel();
    
    message.channel.send(`**${result.original.title}**\n${result.original.date}\n\n${result.original.scripture}\n\n${result.original.text}`);
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
```

### Telegram Bot (using node-telegram-bot-api)

```javascript
const TelegramBot = require('node-telegram-bot-api');
const GospelCatholic = require('gospel_catholic');

const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN', { polling: true });

bot.onText(/\/gospel/, async (msg) => {
  const chatId = msg.chat.id;
  
  const gospel = new GospelCatholic();
  const result = await gospel.getGospel();
  
  bot.sendMessage(chatId, `*${result.original.title}*\n${result.original.date}\n\n${result.original.scripture}\n\n${result.original.text}`, { parse_mode: 'Markdown' });
});

bot.onText(/\/gospel_([a-z]{2})/, async (msg, match) => {
  const chatId = msg.chat.id;
  const language = match[1]; // Language code from the command
  
  const gospel = new GospelCatholic({ language });
  const result = await gospel.getGospel();
  
  bot.sendMessage(chatId, `*${result.translated.title}*\n${result.original.date}\n\n${result.translated.scripture}\n\n${result.translated.text}`, { parse_mode: 'Markdown' });
});
```

## License

MIT
// gospel_catholic/index.js
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * GospelCatholic - A package to fetch and translate daily Catholic gospel readings
 * @class
 */
class GospelCatholic {
  /**
   * Create a new GospelCatholic instance
   * @param {Object} options - Configuration options
   * @param {string} [options.language='en'] - The target language for translation
   */
  constructor(options = {}) {
    this.language = options.language || 'en';
    this.baseUrl = 'https://www.vaticannews.va/en/word-of-the-day.html';
  }

  /**
   * Fetch the gospel of the day
   * @returns {Promise<Object>} - The gospel data with original and translated text
   */
  async getGospel() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);
      
      // Extract the gospel content
      const title = $('.title-article').text().trim();
      const date = $('.date-article').text().trim();
      
      // Extract the scripture passage
      const scripture = $('.scripture-passage').text().trim();
      
      // Extract the gospel text (main content)
      let gospelText = '';
      $('.article-body p').each((i, el) => {
        gospelText += $(el).text().trim() + '\n\n';
      });
      
      // If requested language is not English, translate the text
      let translatedTitle = title;
      let translatedScripture = scripture;
      let translatedGospelText = gospelText;
      
      if (this.language !== 'en') {
        translatedTitle = await this.translate(title, this.language);
        translatedScripture = await this.translate(scripture, this.language);
        translatedGospelText = await this.translate(gospelText, this.language);
      }
      
      return {
        original: {
          title,
          date,
          scripture,
          text: gospelText
        },
        translated: {
          title: translatedTitle,
          date,
          scripture: translatedScripture,
          text: translatedGospelText
        },
        language: this.language
      };
    } catch (error) {
      console.error('Error fetching gospel:', error);
      throw new Error('Failed to fetch gospel of the day');
    }
  }

  /**
   * Translate text using Google Translate API
   * @param {string} text - The text to translate
   * @param {string} targetLang - The target language code
   * @returns {Promise<string>} - The translated text
   */
  async translate(text, targetLang) {
    try {
      // Using Google Translate API (free tier with limitations)
      const encodedText = encodeURIComponent(text);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;
      
      const response = await axios.get(url);
      
      // Google Translate returns an array of translated segments
      let translatedText = '';
      if (response.data && Array.isArray(response.data[0])) {
        response.data[0].forEach(segment => {
          if (segment[0]) {
            translatedText += segment[0];
          }
        });
      }
      
      return translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }
}

module.exports = GospelCatholic;
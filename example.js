// example.js
const GospelCatholic = require('./index');

async function main() {
  console.log('Fetching gospel in English (default)...');
  const englishGospel = new GospelCatholic();
  const englishResult = await englishGospel.getGospel();
  console.log('\n--- ENGLISH GOSPEL ---');
  console.log('Title:', englishResult.original.title);
  console.log('Date:', englishResult.original.date);
  console.log('Scripture:', englishResult.original.scripture);
  console.log('Text:', englishResult.original.text.substring(0, 150) + '...');
  
  console.log('\nFetching gospel in Spanish...');
  const spanishGospel = new GospelCatholic({ language: 'es' });
  const spanishResult = await spanishGospel.getGospel();
  console.log('\n--- SPANISH GOSPEL ---');
  console.log('Title:', spanishResult.translated.title);
  console.log('Date:', spanishResult.original.date);
  console.log('Scripture:', spanishResult.translated.scripture);
  console.log('Text:', spanishResult.translated.text.substring(0, 150) + '...');
  
  console.log('\nFetching gospel in Sinhala...');
  const sinhalaGospel = new GospelCatholic({ language: 'si' });
  const sinhalaResult = await sinhalaGospel.getGospel();
  console.log('\n--- SINHALA GOSPEL ---');
  console.log('Title:', sinhalaResult.translated.title);
  console.log('Date:', sinhalaResult.original.date);
  console.log('Scripture:', sinhalaResult.translated.scripture);
  console.log('Text:', sinhalaResult.translated.text.substring(0, 150) + '...');
}

main().catch(error => {
  console.error('Error in example:', error);
});
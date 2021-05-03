const pageScraper = require('./pageScraper');

const scrapeAll = async (browserInstance) => {
  let browser;
  //creates browser instance and calls object method in pagescraper
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser);
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
  }
};

module.exports = (browserInstance) => scrapeAll(browserInstance);

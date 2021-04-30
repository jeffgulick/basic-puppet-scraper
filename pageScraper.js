let providerList = [];
let mergedList = [];
const scraperObject = {
  url: `http://www.npino.org/doctor/dental-providers/dentist-122300000X?page=`,

  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    //loops through each page of site to be scraped
    for (let i = 1; i <= 5; i++) {
      const temp = `http://www.npino.org/doctor/dental-providers/dentist-122300000X?page=`;

      //changes url on each pass
      scraperObject.url = temp + i;
      console.log(scraperObject.url);
      //navigates to concantnated url
      await page.goto(this.url);
      // Wait for the required DOM to be rendered
      await page.waitForSelector('.npi-record');
      // Get the link to all the required names
      let urls = await page.$$eval('.fullname', (links) => {
        links = links.map((el) => el.querySelector('a').href);
        return links;
      });
      //dumping into array
      providerList.push(urls);
      mergedList = providerList.flat();
    }
    console.log('list', mergedList);
  },
};

module.exports = scraperObject;

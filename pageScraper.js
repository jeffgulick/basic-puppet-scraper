let providerList = [];
let mergedList = [];

const scraperObject = {
  url: `http://www.npino.org/doctor/dental-providers/dentist-122300000X`,

  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    //navigates to concantnated url
    await page.goto(this.url);

    //to run script recurive
    const recursiveLoop = async () => {
      // Wait for the required DOM to be rendered
      await page.waitForSelector('.npi-record');
      // Get the link to all the required names
      let urls = await page.$$eval('.fullname', (links) => {
        links = links.map((el) => el.querySelector('a').href);
        return links;
      });
      providerList.push(urls);
      let nextButtonExist = false;

      //checking for next button;
      try {
        await page.$eval('.next > a', (a) => a.textContent);
        nextButtonExist = true;
      } catch (err) {
        nextButtonExist = false;
      }

      if (nextButtonExist) {
        await page.click('.next > a');
        console.log(providerList);
        return recursiveLoop(); // Call this function recursively
      } else {
        mergedList = providerList.flat();
        console.log('list', mergedList);
        await page.close();
        return mergedList;
      }
    };
    recursiveLoop();
    //dumping into array
  },
};

module.exports = scraperObject;

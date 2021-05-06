let scrapedData = [];

const scraperObject = {
  url: `http://www.npino.org/doctor/dental-providers/dentist-122300000X?page=`,

  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    //loops through each page of site to be scraped
    for (let i = 81; i <= 100; i++) {
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

      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();

          try {
            //{**name**}
            await newPage.goto(link);
            dataObj.name = await newPage.$eval(
              '.col-md-9 > h1',
              (name) => name.textContent
            );
            //{**address**}
            dataObj.street = await newPage.$eval(
              '.address',
              (text) => text.textContent
            );
            dataObj.cityState = await newPage.$eval(
              '.citystate',
              (cityState) => cityState.textContent
            );
            //{**phone}
            dataObj.phone = await newPage.$eval(
              '.phone',
              (phone) => phone.textContent
            );
            //{**fax}
            dataObj.fax = await newPage.$eval('.fax', (fax) => fax.textContent);
            //{**website}
            dataObj.webSite = await newPage.$eval(
              '.website',
              (site) => site.textContent
            );
          } catch (err) {
            console.log(err);
          }

          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
        console.log(currentPageData);
      }
    }
    return scrapedData;
  },
};
module.exports = scraperObject;

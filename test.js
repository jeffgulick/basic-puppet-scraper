let providerList = [];
let mergedList = [];

const scraperObject = {
  url: `http://www.npino.org/doctor/dental-providers/dentist-122300000X?page=`,

  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    //loops through each page of site to be scraped
    for (let i = 1; i <= 1; i++) {
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

      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link);
          dataObj.street = await newPage.$eval(
            '.address',
            (text) => text.textContent
          );
          // dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
          // dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
          // dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
          // dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        // scrapedData.push(currentPageData);
        console.log(currentPageData);
      }
    }
    console.log('list', mergedList);
  },
};

module.exports = scraperObject;

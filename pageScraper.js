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
          dataObj.cityState = await newPage.$eval(
            '.citystate',
            (cityState) => cityState.textContent
          );
          dataObj.phone = await newPage.$eval(
            '.phone',
            (phone) => phone.textContent
          );
          dataObj.fax = await newPage.$eval('.fax', (fax) => fax.textContent);

          // dataObj.phone = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);

          // dataObj.phone = await newPage.$eval('#product_gallery img', img => img.src);
          // dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        // scrapedData.push(currentPageData);
        console.log(currentPageData);
      }

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
  },
};

module.exports = scraperObject;

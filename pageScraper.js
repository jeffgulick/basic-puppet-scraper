let providerList = [];
let mergedList = [];
let finalList = [];

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
        //create promise to look through records and pull out info
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();

          //to resolve promise
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

            //if promise is rejected, will report error and move on
          } catch (err) {
            console.log('Error!!!', err);
          }
          resolve(dataObj);
          await newPage.close();
        });
      //looping through urls
      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        finalList.push(currentPageData);
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

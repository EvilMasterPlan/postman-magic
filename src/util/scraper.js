const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

module.exports.scrapeCommand = async (organization, workspace, requestID) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // The ctx=code parameter pops open the code tab for this request, which conveniently defaults to cURL
  const url = `https://www.postman.com/${organization}/workspace/${workspace}/request/${requestID}?ctx=code`;

  console.log(`scraping curl command from url: ${url}`);

  await page.goto(url);

  await page.waitForSelector('.view-lines');
  await page.waitForSelector('.view-line');
  await delay(1000);
  await page.waitForFunction(`Array.from(document.getElementsByClassName('view-lines'))[0].innerText`);

  const curlText = await page.evaluate(() => {
    return Array.from(document.getElementsByClassName('view-lines'))[0].innerText;
  });

  await browser.close();

  return curlText;
};
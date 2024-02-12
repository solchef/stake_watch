const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const getBrandDetail = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set user agent and other headers as needed
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0");
    
    await page.goto("https://watchcharts.com/charts/brand.json", {
        waitUntil: 'domcontentloaded',
    });
    

    // Wait for the data to load
    // await page.waitForSelector('.your-selector-for-the-data');

    // Get the HTML content of the page
    const htmlContent = await page.content();

    console.log(htmlContent.replace('</pre></body></html>', '').trim())



    // Use Cheerio to parse HTML content
    const $ = cheerio.load(htmlContent);

    // Extract the relevant data
    const jsonData = $('html').text();

    
    console.log(jsonData);

    await browser.close();
};



    getBrandDetail();


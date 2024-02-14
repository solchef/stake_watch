const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const jsonFileUrl = 'https://watchcharts.com/charts/brand.json';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Set the User-Agent header to mimic a regular browser request
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    // Navigate to the JSON file URL
    await page.goto(jsonFileUrl);
    // Get the HTML content after being processed by JavaScript
    const processedHtml = await page.evaluate(() => document.body.innerHTML);
    // Use Cheerio to parse the processed HTML
    const $ = cheerio.load(processedHtml);
    const preContent = $('body > pre').text();
    // Parse the JSON content

    console.log(preContent)
    // const jsonData = JSON.parse(preContent);
    // console.log(jsonData)

    const extractedData = {
      // Add your selectors here
    };

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();

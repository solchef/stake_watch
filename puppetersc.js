const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const metaoutput = './charts/meta/'
const historyoutput = './charts/history'

async function scrapeWebsite(url,i) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage({});

  try {
    await page.goto(url);
    const html = await page.content();

    console.log(html)

    const $ = cheerio.load(html);

      $('pre').each((index, element) => {
        const preContent = $(element).text().trim();
        console.log("Pre Content:", preContent);
        fs.writeFileSync(historyoutput+i+'.json', preContent);
      });

  } catch (error) {
    console.error('Error scraping the website:', error);
  } finally {
    await browser.close();
  }
}

for (let i = 24; i < 34; i++) {
  // let i = 1;
  const url = 'https://watchcharts.com/charts/brand/'+i+'.json';
  // i++;
  scrapeWebsite(url,i);
}

[
    {
      "date": "Test 1",
      "year": [34],
      
    },
  ]

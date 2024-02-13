const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const getBrandDetail = async () => {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();

    // Set user agent and other headers as needed
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0");
    
    await page.goto("https://watchcharts.com/charts/watch/36317.json?type=listings&captcha=0.zaQZqu1BvpXZ-UNH1mYxB58h8YtjrFP1EPT63rdDCgKYpsQb-vqS2LtPSIhYk9j6LLJCWAhJZ-fkD9Y99ZI5Wm8l1zrIUf_LZuK4CjyFn7et55YTK0E1oFTY2ckL5MfVaFbkEYoesMuzTfjA1Yuw3I8wulnZ9-nsOSbdiOnaa5KxhcxhupFR-B7XnLZzHFpeFbuxznqXyTG-u0RnT32lftqyrTPuxstYit019uEyDrGPy_8AZ33ebztLlKm_Fhkt3p1wANhqQPSnw8iQHTuK7o2pfSAqbgMhpzrXFwsdYfLyCHiF9X-zPjCTDHjz0swMZolFSez74xVg2AFFofRnJXLNWheY2yBk7FKlhC3-BYCcYThrc23fWIZdoBWH3F_nRyfLweG0Kq9l_YoFjihjWOExEqsw2N6m083aYui_NWlgjgldRORogEEY6ngdYiYk.EVvCoFUNBkqqh1Vs404Rmg.e65f39b12842bd70430dde08cb1cc116644c434d9589cd78ae215072c4b97b80&_=1707827703262", {
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


const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function readJsonFile(jsonFilePath) {
  try {
    const jsonData = await fs.readFile(jsonFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw new Error('Failed to read JSON file');
  }
}

async function writeJsonFile(jsonFilePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(jsonFilePath, jsonString, 'utf8');
  } catch (error) {
    console.error('Error writing to JSON file:', error);
    throw new Error('Failed to write to JSON file');
  }
}
async function scrapeAndAppendToJSON(existingJsonPath, jsonFileUrl) {
    try {
      const existingData = await readJsonFile(existingJsonPath);
      const updatedData = [];
  
      for (const brand of existingData) {
        console.log(brand);
        const brandUrl = `${jsonFileUrl}${brand.brandSlug}`;
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
  
        try {
          await page.goto(brandUrl, { waitUntil: 'domcontentloaded' });
          console.log('Page URL:', brandUrl); // Check if the page has loaded successfully
  
          // Extract sub-brands using page.evaluate
          const subBrands = await page.evaluate(() => {
            const subBrandElements = document.querySelectorAll('ul.nav.nav-pills.font-sm.mb-4.mb-md-5 li.nav-item.mb-2 a.nav-link');
            console.log('Sub-brand elements:', subBrandElements); // Verify if the elements are selected correctly
            return Array.from(subBrandElements).map(element => {
              return {
                subBrandName: element.textContent.trim(),
                subBrandUrl: element.getAttribute('href'),
              };
            });
          });
  
          updatedData.push({
            ...brand,
            subBrands,
          });
        } catch (error) {
          console.error(`Error scraping ${brandUrl}: ${error.message}`);
        } finally {
          await page.close();
        }
      }
  
      console.log(updatedData);
      await writeJsonFile(existingJsonPath, updatedData);
  
      console.log('Scraping and appending to JSON completed successfully.');
    } catch (error) {
      console.error('Error:', error);
    }
  }

// Example usage

async function main(){
    const existingJsonPath = 'brand_index.json'; // Adjust the path
const jsonFileUrl = 'https://watchcharts.com'; // Adjust the URL
await scrapeAndAppendToJSON(existingJsonPath, jsonFileUrl);

}

main();

const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchJsonData(baseUrl, folderPath) {
  const browser = await puppeteer.launch({headless: true, defaultViewport: null, args: ['--start-maximized']});
  const page = await browser.newPage();

  try {
    for (let i = 1; i <= 71; i++) {
      const url = `${baseUrl}/${i}.json`;
      await page.goto(url);
      const jsonResponse = await page.evaluate(() => {
        // Assuming the JSON data is available directly
        return fetch(window.location.href).then(response => response);
      });
console.log(jsonResponse)
      const fileName = `${folderPath}/${i}.json`;
      const jsonDataString = JSON.stringify(jsonResponse, null, 2); // Format JSON with indentation

      // Create folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(fileName, jsonDataString);
      console.log(`Saved data for ${url} to ${fileName}`);
    }
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  } finally {
    await browser.close();
  }
}

const baseUrl = 'https://watchcharts.com/charts/brand';
const folderPath = './output'; // Replace with your desired folder path
fetchJsonData(baseUrl, folderPath);

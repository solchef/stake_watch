const express = require("express");
const fs = require("fs");

const { scrapeBrands, scrapeIndex, scrapeCollections } = require("./watchcharts/scraping");

// Create an Express application
const app = express();

  
app.get('/market-index', async (req, res) => {
    try {
      const jsonFileUrl = 'https://watchcharts.com/charts/brand.json'; // Replace with the actual URL
      const data = await scrapeIndex(jsonFileUrl);


      const jsonOutputPath = "market_index.json";

        if (data) {
          // Read the existing JSON file only if there's no new data to write
          
         res.json([{ success: true, data }]);
        } else {
          // Write the scraped data to the JSON file if there's no existing data
          const existingData = fs.readFileSync(jsonOutputPath, 'utf8'); // Read as text
          res.send([JSON.parse(existingData)])
        }

      
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  // Route 2
  app.get('/sync/brands', async (req, res) => {
    try {
      const jsonFileUrl = 'https://watchcharts.com/watches/brands'; // Replace with the actual URL
      const data = await scrapeBrands(jsonFileUrl);
      res.json({ success: true, data });
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: error });
    }
  });

  app.get('/brands', async (req, res) => {
    try {
      const jsonFileUrl = 'https://watchcharts.com/watches/brands'; // Replace with the actual URL
      const data = await scrapeBrands(jsonFileUrl);
      res.json({ success: true, data });
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: error });
    }
  });


  app.get('/collections', async (req, res) => {
    try {
      const jsonFileUrl = 'https://watchcharts.com/watches/brand/breitling'; // Replace with the actual URL
      const data = await scrapeCollections(jsonFileUrl);
      res.json({ success: true, data });
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, error: error });
    }
  });


const port = 3002;
// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

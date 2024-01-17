const express = require("express");
const { scrapeBrands, scrapeIndex, scrapeCollections } = require("./watchcharts/scraping");

// Create an Express application
const app = express();

  
app.get('/market-index', async (req, res) => {
    try {
      const jsonFileUrl = 'https://watchcharts.com/charts/brand.json'; // Replace with the actual URL
      const data = await scrapeIndex(jsonFileUrl);
      res.json({ success: true, data });
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

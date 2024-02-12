const express = require("express");
const fs = require("fs");
const axios = require("axios");
const puppeteer = require('puppeteer');


const {
	scrapeBrands,
	scrapeIndex,
	scrapeCollections,
} = require("./watchcharts/scraping");
const brands = require("./brands");
const marketIndexes = require("./services/overall-indexes");
const overall = require("./services/indexes/overallindex.json");
const overallModels = require("./services/indexes/overallModels.json");

const app = express();

const headers = {
	"Content-Type": "application/json",
	Authorization: "Basic YXBpdXBkYXRlOjNnSzggVXpjdiBCY2lwIGFYVGogcXFQWCBlQXNk",
};

app.get("/", async (req, res) => {
	res.json({ success: true, message: "You are at Stakewatch API''s" });
});

app.get("/getMarketIndexingSummary", async (req, res) => {
	const type = req.query.page;
	//deduce queries
	// console.log(marketIndexes)
	try {
		res.json(marketIndexes);
	} catch (error) {
		console.error(error);
	}
});



app.post("/updateMarketIndexingSummary", async (req, res) => {
	const brandsIndex = marketIndexes.brandIndexes;

	brandsIndex.forEach(async (brand) => {
		console.log(brand);
		const data = {
			market_value: brand.w25,
			"6m_change": brand.change,
			group_type: "brands",
			type_name: brand.Title,
			historical_data: [],
		};
		// {
		// 	"parent_id": 56,  // Replace with the actual parent ID
		// 	"child_id": 234,   // Replace with the actual child ID
		// 	"context": "child",
		// 	"store_items_type": "replace/update",
		// 	"meta": {
		// 	  "market_value": brand.w25,
		// 	  "6m_change": brand.w25,
		// 	  "group_type": "brands",
		// 	  "type_name": brand.Title,
		// 	  "historical_data": []
		// 	}
		//   }

		const apiUrl =
			"https://stakewatch.dubbydesign.com/wp-json/jet-cct/market_index";
		const response = await axios.post(apiUrl, data, { headers });

		console.log(response);
	});

	//  res.json({success: true, message: "Market Indexing Summary Updated"});

	try {
		res.json({ success: true, message: "Market Indexing Summary Updated" });
	} catch (error) {
		console.error("error", error);
	}
});


app.get("/getChatAnalysis", async (req, res) => {

	const chartData = req.query.chartData;
		console.log(chartData);
		
		const analyticItams = {
			"change":{
				"1m": 0.5,
				"3m": 0.5,
				"6m": 0.5,
			},
			"aggr":{
				"1m": 6.5,
				"3m": 0.5,
				"6m": 0.5,
			},
			}


	return analyticItams
});


app.post("/insertModelsAndPrices", async (req, res) => {

	const data =
	{
		"parent_id": parent.id,
		"child_id": children.id,
		"context": "child",
		"store_items_type": "replace/update",
		"meta": {
			"market_value": 100,
			"6m_change": 0.5,
			"group_type": "brands",
			"type_name": "Rolex",
			"historical_data": []
		}
	}

	let parent = await axios.post('https://stakewatch.dubbydesign.com/wp-json/jet-rel/59', {
		headers: {
			'Authorization': 'Basic YXBpdXBkYXRlOjNnSzggVXpjdiBCY2lwIGFYVGogcXFQWCBlQXNk'
		},
		data

	}, {


	}, {})
})




app.get("/overallPriceHistory", async (req, res) => {
	try {
		res.json(overall);
	} catch (error) { }
});


app.get("/getModelIndexHistory", async (req, res) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const index = await axios.get()

	// Set user agent and other headers as needed
	await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0");

	await page.goto("https://watchcharts.com/charts/brand.json", {
		waitUntil: 'domcontentloaded',
	});

	const htmlContent = await page.content();

	const respose = htmlContent.replace('</pre></body></html>', '').trim();

	const regex = /"data":\{"all":\{(.*?)\}/;
	const match = htmlContent.match(regex);
	console.log(match);
	if (match && match[1]) {
		// The matched portion contains your desired data
		let jsonData = match[1].trim();
		jsonData = jsonData.substring(0, jsonData.length - 1);

		// console.log|(jsonData);

	}

	console.log | (JSON.stringify(respose));

	await browser.close();

	// const keys = Object.keys(jsonObject);
	// if (keys.length > 0) {
	//     const firstKey = keys[0];
	//     jsonObject[firstKey] = "newValue"; // Replace with your new value
	// }


	res.json(respose);

});


app.get("/getTopModelsIndexes", async (req, res) => {
	try {

		res.json(overallModels);
	} catch (error) { }
});


app.get("/market-index", async (req, res) => {
	try {
		const jsonFileUrl = "";
		const data = await scrapeIndex(jsonFileUrl);

		const jsonOutputPath = "market_index.json";

		if (data) {
			// Read the existing JSON file only if there's no new data to write

			res.json([{ success: true, data }]);
		} else {
			// Write the scraped data to the JSON file if there's no existing data
			const existingData = fs.readFileSync(jsonOutputPath, "utf8"); // Read as text
			res.send([JSON.parse(existingData)]);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

// Route 2
app.get("/sync/brands", async (req, res) => {
	try {
		const jsonFileUrl = "https://watchcharts.com/watches/brands"; // Replace with the actual URL
		const data = await scrapeBrands(jsonFileUrl);
		res.json({ success: true, data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error });
	}
});

app.get("/oldbrands", async (req, res) => {
	try {
		const jsonFileUrl = "https://watchcharts.com/watches/brands"; // Replace with the actual URL
		const data = await scrapeBrands(jsonFileUrl);
		res.json({ success: true, data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error });
	}
});

app.get("/collections", async (req, res) => {
	try {
		const jsonFileUrl = "https://watchcharts.com/watches/brand/breitling"; // Replace with the actual URL
		const data = await scrapeCollections(jsonFileUrl);
		res.json({ success: true, data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error });
	}
});

app.get("/get-brands", async (req, res) => {
	// const options = {
	// 	method: "GET",
	// 	url: "https://chrono241.p.rapidapi.com/brands",
	// 	headers: {
	// 		"X-RapidAPI-Key": "be31f8812bmshaf5a1e9248a26f6p1aec23jsn676eaede7a19",
	// 		"X-RapidAPI-Host": "chrono241.p.rapidapi.com",
	// 	},
	// };

	const response = brands;
	// console.log(response);

	try {
		res.json(response);
	} catch (error) {
		console.error(error);
	}
});

app.get("/get-models", async (req, res) => {
	const brand = req.query.brand;

	const options = {
		method: "GET",
		url: "https://chrono241.p.rapidapi.com/models",
		params: { brandID: brand },
		headers: {
			"X-RapidAPI-Key": "be31f8812bmshaf5a1e9248a26f6p1aec23jsn676eaede7a19",
			"X-RapidAPI-Host": "chrono241.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);
		// console.log(response);
		res.json([response.data]);
	} catch (error) {
		console.error(error);
	}
});

app.get("/get-perfomance-index", async (req, res) => {
	const options = {
		method: "GET",
		url:
			"https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Market&period=max",
		headers: {
			"X-RapidAPI-Key": "be31f8812bmshaf5a1e9248a26f6p1aec23jsn676eaede7a19",
			"X-RapidAPI-Host": "chrono241.p.rapidapi.com",
		},
	};

	try {
		const response = await axios.request(options);
		// console.log(response);
		res.json([response.data]);
	} catch (error) {
		console.error(error);
	}
});




const port = 3002;
// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});





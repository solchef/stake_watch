const express = require("express");
const fs = require("fs");
const axios = require("axios");
const puppeteer = require('puppeteer');


// const SUPABASE_URL = 'https://aivkxljfsjpgrlyssvpy.supabase.co'
// const SUPABASE_ANON_KEY = 'your-anon-key'

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



const {
	scrapeBrands,
	scrapeIndex,
	scrapeCollections,
} = require("./watchcharts/scraping");
// const brands = require("./brands");
const marketIndexes = require("./services/overall-indexes");
const overall = require("./services/indexes/overallindex.json");
const overallModels = require("./services/indexes/overallModels.json");
const { time } = require("console");
const chartFunctions = require("./chart-functions");
// const bukkExport = require("./bulkimporter");

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

	// brandsIndex.forEach(async (brand) => {
		// console.log(brand);
		// const data = {
		// 	market_value: brand.w25,
		// 	"6m_change": brand.change,
		// 	group_type: "brands",
		// 	type_name: brand.Title,
		// 	historical_data: [],
		// };
	     
	// });

	//  res.json({success: true, message: "Market Indexing Summary Updated"});
	
	updateMarketIndexingSummary
	try {
		  bukkExport();
		res.json({ success: true, message: "Market Indexing Summary Updated" });
	} catch (error) {
		console.error("error", error);
	}
});


// Function to transform Unix timestamp to human-readable date
function transformTimestamps(data) {
	const transformedData = {};
  
	for (const timestamp in data) {
	  // Create a new Date object with the Unix timestamp
	  const date = new Date(timestamp * 1000);
  
	  // Format the date to a human-readable format (only day)
	  const day = date.getDate();
  
	  // Add the formatted date and the price to the transformedData object
	  transformedData[day] = data[timestamp];
	}

	console.log(transformedData)
  
	return transformedData;
  }


app.get("/getchartanalysis", async (req, res) => {

	// Function to retrieve price data for the specified range of days
function get_price_data_for_range($start_date, $end_date) {
    // Query database using JetEngine custom queries
    // Return price data for the specified range
}

// Function to calculate percentage change for each day
function calculate_percentage_change($price_data) {
    // Calculate percentage change for each day
    // Return an array of percentage changes
}

// Function to calculate AAGR
function calculate_aagr($price_data) {
    // Calculate AAGR based on initial and final prices
    // Return the calculated AAGR
}

// Function to calculate percentage change for 1M, 3M, and 6M periods
function calculate_percentage_changes_for_periods($price_data) {
    // Calculate prices for 1M, 3M, and 6M periods
    // Calculate percentage changes for these periods
    // Return an array of percentage changes
}

const chartData = req.query.chartData;
//console.log(chartData);
let sortedData = require('./market_index.json');

  console.log(transformTimestamps(sortedData));

   // Get the price data for the start and end of the year

const oneMonthAgo = new Date();
   oneMonthAgo.setMonth(new Date().getMonth);


// Function to display the calculated metrics
function display_calculated_metrics() {
    // Retrieve price data for the specified range
    $price_data = get_price_data_for_range('start_date', 'end_date');

    // Calculate percentage change for each day
    $percentage_changes = calculate_percentage_change($price_data);

    // Calculate AAGR
    $aagr = calculate_aagr($price_data);

    // Calculate percentage changes for 1M, 3M, and 6M periods
    $percentage_changes_periods = calculate_percentage_changes_for_periods($price_data);

    // Display the calculated metrics
    // You can format and output these values as needed

return {
	 "Percentage_changes: ": ($percentage_changes),
     "AAGR: " : $aagr,
     "1M Percentage Change:":   $percentage_changes_periods['1M'],
     "3M Percentage Change:": $percentage_changes_periods['3M'],
     "6M Percentage Change: " : $percentage_changes_periods['6M']
}
    
}

	// console.log(display_calculated_metrics())
	res.json({success:true});

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


function filterData(data, months) {
    if (months === "all") return data;
    
    const result = {};
    const keys = Object.keys(data);
    const lastKey = keys[keys.length - 1];
    const cutoffDate = new Date(parseInt(lastKey) * 1000);
    cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - months);
    
    for (const key in data) {
        if (parseInt(key) * 1000 >= cutoffDate.getTime()) {
            result[key] = data[key];
        }
    }
    
    return result;
}

function updateSummary(data) {
    const values = Object.values(data);
    // Update summary here
}

function mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values) {
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

function standardDeviation(values) {
    const avg = mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

function variance(values) {
    const avg = mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return mean(squareDiffs);
}

function timestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
}


app.post('/generateChart', (req, res) => {
    // const inputDataString = req.data.dataInput;
    const inputData = {"1609459200": 27237.744820078562,
	"1609545600": 27253.25137642119,
	"1609632000": 27267.776477971307,
	"1609718400": 27270.928191378945,
	"1609804800": 27293.68704879689,
	"1609891200": 27280.302577250164,
	"1609977600": 27306.487207402588,
	"1610064000": 27361.199735591537,
	"1610150400": 27386.47930793252,
	"1610236800": 27422.489928141724,
	"1610323200": 27433.950148234442,
	"1610409600": 27460.107318951825,
	"1610496000": 27465.86158783091,
	"1610582400": 27476.33661825516,
	"1610668800": 27503.728185095646,
	"1610755200": 27541.425434253677,
	"1610841600": 27542.455208643623,
	"1610928000": 27492.080009105815,
	"1611014400": 27456.40896833757,
	"1611100800": 27475.399571551407,
	"1611187200": 27477.167423185056,
	"1611273600": 27506.540076134694,
	"1611360000": 27552.203075934318,
	"1611446400": 27565.033901917857,
	"1611532800": 27603.3278212591,
	"1611619200": 27641.26405938021,
	"1611705600": 27675.895661832288}

    // const filter = req.body.filter;
    const filteredData = filterData(inputData, '3');

    const chartData = {
        labels: Object.keys(filteredData).map(timestampToDate),
        datasets: [{
            label: 'Data Points',
            data: Object.values(filteredData),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    res.send(chartData);

	 

    // Update summary
   // chartFunctions.updateSummary(filteredData);
});








const port = 3002;
// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});





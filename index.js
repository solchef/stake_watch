const express = require("express");
const fs = require("fs");
const axios = require("axios");
const puppeteer = require('puppeteer');
const generateSummaryChart = require('./mainChart');

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
	console.log(marketIndexes)
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
		//res.json([response.data]);
	} catch (error) {
		console.error(error);
	}
});


function getFirst30Items(obj, count) {
    let first30Items = {};
    let keys = Object.keys(obj);
    for (let i = 0; i < count && i < keys.length; i++) {
        let key = keys[i];
        first30Items[key] = obj[key];
    }
    return first30Items;
}


  function transformToSeries(data) {
	for (let timestamp in data) {
		seriesData.push({ Date: parseInt(timestamp), Price: data[timestamp] });
	}
	return series;
}

// // Make API call using wp_remote_get()
// $response = wp_remote_get('https://api.example.com/data');

// // Check if API call was successful
// if (!is_wp_error($response) && $response['response']['code'] == 200) {
//     // API call succeeded, parse response
//     $body = wp_remote_retrieve_body($response);
//     // Do something with $body (parsed response data)
// } else {
//     // API call failed, handle error
//     $error_message = is_wp_error($response) ? $response->get_error_message() : 'Unknown error';
//     echo "API call failed: $error_message";
// }


app.get('/get-chart', (req, res) => {
	const summary =  require('./market_index.json');
		const chartData = {
		 one: transformToSeries(getFirst30Items(summary,30).data.all),
		 three: transformToSeries(getFirst30Items(summary,0).data.all),
		 six: transformToSeries(getFirst30Items(summary,90).all)
		}	

	res.json(chartData.one);

})

https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Collection&period=max	


app.get("/indexes/get-collection-perfomance-index", async (req, res) => {
	const options = {
		method: "GET",
		url:
			"https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Collection&period=max",
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

app.get("indexes/get-market-perfomance-index", async (req, res) => {
	const options = {
		method: "GET",
		url:
			"https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Brannd&period=max",
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

app.get("/indexes/get-brand-perfomance-index", async (req, res) => {
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

var demoData = 
{
	"data": [
	  {
		"name": "Test 1",
		"data": [
		  34,
		  85,
		  95,
		  74,
		  56,
		  24
		]
	  },
	  {
		"name": "Test 2",
		"data": [
		  54,
		  45,
		  21,
		  56,
		  45,
		  45
		]
	  },
	  {
		"name": "Test 3",
		"data": [
		  45,
		  34,
		  65,
		  45,
		  76,
		  45
		]
	  },
	  {
		"name": "Test 4",
		"data": [
		  87,
		  56,
		  45,
		  87,
		  65,
		  78
		]
	  },
	  {
		"name": "Test 5",
		"data": [
		  87,
		  56,
		  45,
		  43,
		  56,
		  76
		]
	  }
	],
	"category": [
	  "Jan",
	  "Feb",
	  "Mar",
	  "Apr",
	  "May",
	  "Jun"
	]
  }

  app.get("/demo-test", (req, res) => {
	
	  res.send(demoData)
  });


  // Assuming data is a simplified version of your dataset for demonstration
const data = {
    "1577836800": 619.56, // Jan 1, 2020
    "1580515200": 617.28, // Feb 1, 2020
    "1583020800": 615.79, // Mar 1, 2020
    "1585699200": 613.34, // Apr 1, 2020
    "1588291200": 611.88, // May 1, 2020
    "1590969600": 610.42, // Jun 1, 2020
    // More data points can be added
};

// Helper function to get month key for aggregation
function getMonthKey(unixTimestamp, monthInterval) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1; // getUTCMonth() returns months from 0-11
    month = Math.ceil(month / monthInterval) * monthInterval - (monthInterval - 1);
    month = month < 10 ? `0${month}` : `${month}`; // Ensure two-digit format
    return `${year}-${month}`;
}

// Function to aggregate and average data
function aggregateData(data, monthInterval) {
    const aggregated = {};

    Object.entries(data).forEach(([timestamp, price]) => {
        const key = getMonthKey(timestamp, monthInterval);
        if (!aggregated[key]) {
            aggregated[key] = [];
        }
        aggregated[key].push(price);
    });

    return Object.entries(aggregated).map(([key, prices]) => {
        const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        return { key, average };
    });
}

app.get("/render-chart-request-data", (req, res) => {
// const cat = req.url;
// console.log(cat);
const structuredData = {
    "1Month": {
        data: aggregateData(data, 1),
        category: ['1 Month Interval']
    },
    "3Months": {
        data: aggregateData(data, 3),
        category: ['3 Months Interval']
    },
    "6Months": {
        data: aggregateData(data, 6),
        category: ['6 Months Interval']
    }
};



console.log(structuredData["1Month"].data)

res.send(structuredData["1Month"]);
	
});

const port = 3000
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});



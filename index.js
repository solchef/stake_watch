const express = require("express");
const fs = require("fs");
const axios = require("axios");
const puppeteer = require('puppeteer');

const {
	scrapeBrands,
	scrapeIndex,
	scrapeCollections,
} = require("./watchcharts/scraping");

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
	// //console.log(marketIndexes)
	try {
		res.json(marketIndexes);
	} catch (error) {
		// //console.error(error);
	}
});






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

	//console.log(transformedData)
  
	return transformedData;
  }




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
	//console.log(match);
	if (match && match[1]) {
		// The matched portion contains your desired data
		let jsonData = match[1].trim();
		jsonData = jsonData.substring(0, jsonData.length - 1);

		// //console.log|(jsonData);

	}

	//console.log | (JSON.stringify(respose));

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
		//console.log(error);
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
		//console.log(error);
		res.status(500).json({ success: false, error: error });
	}
});



app.get("/collections", async (req, res) => {
	try {
		const jsonFileUrl = "https://watchcharts.com/watches/brand/breitling"; // Replace with the actual URL
		const data = await scrapeCollections(jsonFileUrl);
		res.json({ success: true, data });
	} catch (error) {
		//console.log(error);
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
		//console.error(error);
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


app.get('/get-chart', (req, res) => {
	const summary =  require('./market_index.json');
		const chartData = {
		 one: transformToSeries(getFirst30Items(summary,30).data.all),
		 three: transformToSeries(getFirst30Items(summary,0).data.all),
		 six: transformToSeries(getFirst30Items(summary,90).all)
		}	

	res.json(chartData.one);

})




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
		// //console.log(response);
		res.json([response.data]);
	} catch (error) {
		//console.error(error);
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
		// //console.log(response);
		res.json([response.data]);
	} catch (error) {
		//console.error(error);
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
		// //console.log(response);
		res.json([response.data]);
	} catch (error) {
		//console.error(error);
	}
});



function getMonthKey(unixTimestamp, monthInterval) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1; // getUTCMonth() returns months from 0-11
    month = Math.ceil(month / monthInterval) * monthInterval - (monthInterval - 1);
    month = month < 10 ? `0${month}` : `${month}`; // Ensure two-digit format
    return `${year}-${month}`;
}


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

function filterData(data, rangeInDays) {
	const now = new Date();
	const startDate = new Date(now.getTime() - rangeInDays * 24 * 60 * 60 * 1000);
  
	const filteredData = Object.entries(data)
	  .filter(([timestamp]) => new Date(parseInt(timestamp) * 1000) >= startDate)
	  .map(([timestamp, price]) => {
		return {
		  date: new Date(parseInt(timestamp) * 1000),
		  price: price,
		};
	  });
  
	return filteredData;
  }
  

  function formatChartData(data) {
	const categories = []; // Dates
	const values = []; // Values for Test 1
  
	data.forEach(item => {
	  categories.push(item.date.toLocaleDateString()); // Assuming date format as string
	  values.push(item.price);
	});
  
	return {
	  data: [
		{
		  name: 'Historical Price',
		  data: values,
		}
	  ],
	  category: categories,
	};
  }
  
  
app.get(`/render-chart-request-data`, (req, res) => {
  const watch_id = req.query.watch_id;
  console.log(req.query);
 // const request_watch = axios.get(`https://stakewatch.clients.dsgn.haus/wp-json/wp/v2/watches/${watch_id}`);
//   const watch_details = request_watch.data;
  const data = require(`./charts/history24.json`);
  let hist = data.data.all;
  // Format datasets for the chart
  
 const type = req.query.type;

 let filteredData;

  if(type === '1M') {
	filteredData = filterData(hist, 30);
  }else if(type === '3M') {
	filteredData = filterData(hist, 90);
  }else if(type === '6M') {
	filteredData = filterData(hist, 180);
  }else if(type === '1Y') {
	filteredData = filterData(hist, 365);
  }else{
	filteredData = [];
  }

//   const info = {
// 		marketprice: watch_details.meta.watch-market-price,
// 		retailprice: watch_details.meta.watch-retail-price,
// 		brand: watch_details.brands[0],
// 		collection: watch_details.collections[0],
// 		model: watch_details.title.rendered,
// 		percentage_difference: ((watch_details.meta.watch-market-price - watch_details.meta.watch-retail-price) / watch_details.meta.watch-retail-price) * 100,
		
//   }
 
  const formattedData = formatChartData(filteredData);

res.send(formattedData);
	
});

app.post("/insertModelsAndPrices", async (req, res) => {

	const data =
	{
        "slug": "grand-seiko-sbga407",
        "status": "publish",
        "type": "watches",
        "link": "https://stakewatch.clients.dsgn.haus/watches/grand-seiko-sbga407/",
        "title": {
            "rendered": "SBGA407"
        },
        "content": {
            "rendered": "<p>The Grand Seiko SBGA407 is a watch model from the Grand Seikobrand.As of February 2024, the average price of the Grand Seiko SBGA407 on the private sales market is $4,145, while you can expect to pay $4,283 from a secondary market dealer.</p>\n",
            "protected": false
        },
        "featured_media": 2089,
        "parent": 0,
        "template": "",
        "meta": {
            "complication": [],
            "styles": "Central seconds",
            "references": [
                {
                    "reference": ""
                }
            ],
            "features": [
                "Steel",
                "",
                ""
            ],
            "bezel-material": [
                "Steel"
            ],
            "crystal": [
                "100",
                "meters"
            ],
            "dial-color": [
                "40.2mm"
            ],
            "case-material": [
                "No",
                "numerals"
            ],
            "lug-width": "",
            "water-resistance": "12.8mm",
            "movement-type": "Automatic",
            "number-of-jewels": "72 hours",
            "power-reserve": "",
            "frequency": "30",
            "watch-market-price": "4,145",
            "watch-retail-price": "5800",
            "watch-market-value": "",
            "model-history-file": null,
            "history": []
        },
        "brands": [
            59
        ],
        "collections": []
	}


	 await axios.post('https://stakewatch.dubbydesign.com/wp-json/jet-rel/59', {
		headers: {
			'Authorization': 'Basic YXBpdXBkYXRlOjNnSzggVXpjdiBCY2lwIGFYVGogcXFQWCBlQXNk'
		},
		data

	});
})


app.post("/updateMarketIndexingSummary", async (req, res) => {
	const wordpressAuth = {
		headers: {
			Authorization:
				"Basic" + "",
		},
	};

	const brandsIndex = marketIndexes.brandIndexes;

	brandsIndex.forEach(async (brand) => {
		const data = {
			market_value: brand.w25,
			"6m_change": brand.change,
			group_type: "brands",
			type_name: brand.Title,
			historical_data: [],
		};
	     
	});

	 res.json({success: true, message: "Market Indexing Summary Updated"});
	
	try {
		  bukkExport();
		res.json({ success: true, message: "Market Indexing Summary Updated" });
	} catch (error) {
		//console.error("error", error);
	}
});

const port = 3000
app.listen(port, () => {});



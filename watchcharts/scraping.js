// scraper.js

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");


const brandScrapeUrl = "https://watchcharts.com/watches/brand_index/patek+philippe";

async function scrapeIndex() {
	const brand = "rolex";
	const pages = 1;
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage();
  // Set cookies
  await page.setCookie({
	'name': 'cookieName',
	'value': 'cookieValue',
	'domain': 'watchcharts.com',
});

// Verify cookies have been set
const cookies = await page.cookies();
// console.log(cookies);

await page.setCookie(...cookies);

  await page.goto(brandScrapeUrl);

  const content = await page.content();

  console.log(content)

  const $ = cheerio.load(content);

  const watchLinks = $(".nav-link")
    .map((i, el) => $(el).attr("href"))
    .get();

  console.log(watchLinks);

	const brandElements = $(
		"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a",
	);
	//
	console.log(brandElements)
	const scrapedData = [];
	for (let index = 0; index < brandElements.length; index++) {
		const row = brandElements.eq(index);
		const imageSelector =
			"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a img";
		await page.waitForSelector(imageSelector);
		
		const brandName = $(row).find("img").attr("alt");
		await page.waitForSelector(
			"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a img[src]",
		);

// This will print the array containing the text of each list item

  await browser.close();
}
}

async function scrapeBrands(jsonFileUrl) {
	const browser = await puppeteer.launch({
		headless: false,
	});

	const page = await browser.newPage();
	// await page.waitForSelector('div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a img');

	await page.goto(jsonFileUrl);
	const htmlContent = await page.content();

	const $ = cheerio.load(htmlContent);

	const brandElements = $(
		"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a",
	);
	//
	// console.log(brandElements)
	const scrapedData = [];
	for (let index = 0; index < brandElements.length; index++) {
		const row = brandElements.eq(index);
		const imageSelector =
			"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a img";
		await page.waitForSelector(imageSelector);

		const brandName = $(row).find("img").attr("alt");
		await page.waitForSelector(
			"div.position-relative.col-6.col-lg-3.d-flex.align-items-center.justify-content-center a img[src]",
		);

		const imageUrl = await page.$eval(imageSelector, (img) =>
			img.getAttribute("src"),
		);

		const brandSlug = $(row).attr("href");

		const payload = {
			brandName,
			imageUrl,
			brandSlug,
		};

		scrapedData.push(payload);
	}

	await browser.close();
	console.log(scrapedData);
	const jsonOutputPath = "brand_index.json";
	fs.writeFileSync(jsonOutputPath, JSON.stringify(scrapedData, null, 2));
	console.log(`Scraped data written to ${jsonOutputPath}`);

	return scrapedData;
}

async function scrapeCollections(brandUrl) {
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		// Navigate to the JSON file URL
		await page.goto(brandUrl);

		// Get the HTML content after being processed by JavaScript
		const processedHtml = await page.evaluate(() => document.body.innerHTML);

		console.log(processedHtml);

		const $ = cheerio.load(processedHtml);

		const modelElements = $("li.nav-item.mb-2 a");

		// console.log(modelElements)
		// Extract model data from each element
		const models = modelElements
			.map((index, element) => {
				const modelName = $(element).find(".model-name").text();
				const modelImage = $(element).find(".model-image").attr("src");

				return { modelName, modelImage };
			})
			.get();

		return models;
	} catch (error) {
		console.error("Error:", error.body);
		throw new Error("Scraping failed for brand collections");
	}
}

async function scrapeModels(brandUrl) {
	try {
		// Use axios to fetch the HTML content
		const response = await axios.get(brandUrl);
		const htmlContent = response.data;

		// Use Cheerio to parse the HTML content
		const $ = cheerio.load(htmlContent);

		// Select all elements containing brand models based on your HTML structure
		const modelElements = $(".model-selector-element"); // Adjust the selector based on your HTML

		// Extract model data from each element
		const models = modelElements
			.map((index, element) => {
				const modelName = $(element).find(".model-name").text();
				const modelImage = $(element).find(".model-image").attr("src");

				return { modelName, modelImage };
			})
			.get();

		return models;
	} catch (error) {
		console.error("Error:", error);
		throw new Error("Scraping failed for brand models");
	}
}

// const scrapeTaxonomies = {
// 	scrapeBrands,
// 	scrapeModels,
// 	scrapeIndex,
// 	scrapeCollections,
// };

// module.exports = scrapeTaxonomies;

var wronginput = [
	{
		"Text": "\n\n Rolex\n\n\n\nDatejust \n\n\n\nSubmariner \n\n\n\nGMT-Master \n\n\n\nDaytona \n\n\n\n+12 \n\n\n\nOyster Perpetual \n\n\n\nDay-Date \n\n\n\nYacht-Master \n\n\n\nSea-Dweller \n\n\n\nExplorer \n\n\n\nExplorer II \n\n\n\nAir-King \n\n\n\nSky-Dweller \n\n\n\nDate \n\n\n\nMilgauss \n\n\n\nCellini \n\n\n\nPearlmaster \n\n\n\n1908 \n\n",
		"Text1": "\n\n Rolex\n\n\n\nDatejust \n\n\n\nSubmariner \n\n\n\nGMT-Master \n\n\n\nDaytona \n\n\n\n+12 \n\n\n\nOyster Perpetual \n\n\n\nDay-Date \n\n\n\nYacht-Master \n\n\n\nSea-Dweller \n\n\n\nExplorer \n\n\n\nExplorer II \n\n\n\nAir-King \n\n\n\nSky-Dweller \n\n\n\nDate \n\n\n\nMilgauss \n\n\n\nCellini \n\n\n\nPearlmaster \n\n\n\n1908 \n\n"
	},
	{
		"Text": "\n\n Omega\n\n\n\nSeamaster \n\n\n\nSpeedmaster \n\n\n\nConstellation \n\n\n\nAqua Terra \n\n\n\n+3 \n\n\n\nDe Ville \n\n\n\nPlanet Ocean \n\n\n\nDynamic \n\n\n\nRailmaster \n\n",
		"Text1": "\n\n Omega\n\n\n\nSeamaster \n\n\n\nSpeedmaster \n\n\n\nConstellation \n\n\n\nAqua Terra \n\n\n\n+3 \n\n\n\nDe Ville \n\n\n\nPlanet Ocean \n\n\n\nDynamic \n\n\n\nRailmaster \n\n"
	},
	{
		"Text": "\n\n TAG Heuer\n\n\n\nAquaracer \n\n\n\nCarrera \n\n\n\nFormula 1 \n\n\n\nMonaco \n\n\n\n+3 \n\n\n\nLink \n\n\n\nAutavia \n\n\n\nConnected \n\n\n\nKirium \n\n",
		"Text1": "\n\n TAG Heuer\n\n\n\nAquaracer \n\n\n\nCarrera \n\n\n\nFormula 1 \n\n\n\nMonaco \n\n\n\n+3 \n\n\n\nLink \n\n\n\nAutavia \n\n\n\nConnected \n\n\n\nKirium \n\n"
	},
	{
		"Text": "\n\n Breitling\n\n\n\nChronomat \n\n\n\nNavitimer \n\n\n\nSuperocean \n\n\n\nAvenger \n\n\n\n+13 \n\n\n\nSuperocean Heritage \n\n\n\nColt \n\n\n\nPremier \n\n\n\nAviator 8 \n\n\n\nBentley \n\n\n\nAerospace \n\n\n\nWindrider \n\n\n\nMontbrillant \n\n\n\nGalactic \n\n\n\nTransocean \n\n\n\nCockpit \n\n\n\nChrono-Matic \n\n\n\nChronoliner \n\n\n\nNavitimer 8 \n\n",
		"Text1": "\n\n Breitling\n\n\n\nChronomat \n\n\n\nNavitimer \n\n\n\nSuperocean \n\n\n\nAvenger \n\n\n\n+13 \n\n\n\nSuperocean Heritage \n\n\n\nColt \n\n\n\nPremier \n\n\n\nAviator 8 \n\n\n\nBentley \n\n\n\nAerospace \n\n\n\nWindrider \n\n\n\nMontbrillant \n\n\n\nGalactic \n\n\n\nTransocean \n\n\n\nCockpit \n\n\n\nChrono-Matic \n\n\n\nChronoliner \n\n\n\nNavitimer 8 \n\n"
	},
	{
		"Text": "\n\n Casio\n\n\n\nG-Shock \n\n\n\nPro Trek \n\n\n\nEdifice \n\n",
		"Text1": "\n\n Casio\n\n\n\nG-Shock \n\n\n\nPro Trek \n\n\n\nEdifice \n\n"
	},
	{
		"Text": "\n\n Tudor\n\n\n\nBlack Bay \n\n\n\nPrince \n\n\n\nPelagos \n\n\n\nSubmariner \n\n",
		"Text1": "\n\n Tudor\n\n\n\nBlack Bay \n\n\n\nPrince \n\n\n\nPelagos \n\n\n\nSubmariner \n\n"
	},
	{
		"Text": "\n\n Panerai\n\n\n\nLuminor \n\n\n\nRadiomir \n\n\n\nFerrari \n\n",
		"Text1": "\n\n Panerai\n\n\n\nLuminor \n\n\n\nRadiomir \n\n\n\nFerrari \n\n"
	},
	{
		"Text": "\n\n IWC\n\n\n\nPilot \n\n\n\nPortugieser \n\n\n\nPortofino \n\n\n\nAquatimer \n\n\n\n+2 \n\n\n\nIngenieur \n\n\n\nDa Vinci \n\n\n\nJubilee \n\n",
		"Text1": "\n\n IWC\n\n\n\nPilot \n\n\n\nPortugieser \n\n\n\nPortofino \n\n\n\nAquatimer \n\n\n\n+2 \n\n\n\nIngenieur \n\n\n\nDa Vinci \n\n\n\nJubilee \n\n"
	},
	{
		"Text": "\n\n Audemars Piguet\n\n\n\nRoyal Oak \n\n\n\nRoyal Oak Offshore \n\n\n\nCODE 11.59 \n\n\n\nMillenary \n\n\n\n+2 \n\n\n\nJules Audemars \n\n\n\nRoyal Oak Concept \n\n\n\nClassique \n\n",
		"Text1": "\n\n Audemars Piguet\n\n\n\nRoyal Oak \n\n\n\nRoyal Oak Offshore \n\n\n\nCODE 11.59 \n\n\n\nMillenary \n\n\n\n+2 \n\n\n\nJules Audemars \n\n\n\nRoyal Oak Concept \n\n\n\nClassique \n\n"
	},
	{
		"Text": "\n\n Citizen\n\n\n\nEco-Drive \n\n\n\nPromaster \n\n\n\nSatellite Wave \n\n",
		"Text1": "\n\n Citizen\n\n\n\nEco-Drive \n\n\n\nPromaster \n\n\n\nSatellite Wave \n\n"
	},
	{
		"Text": "\n\n Patek Philippe\n\n\n\nComplications \n\n\n\nNautilus \n\n\n\nAquanaut \n\n\n\nCalatrava \n\n\n\n+4 \n\n\n\nGrand Complications \n\n\n\nTwenty~4 \n\n\n\nGondolo \n\n\n\nGolden Ellipse \n\n\n\nPocket Watches \n\n",
		"Text1": "\n\n Patek Philippe\n\n\n\nComplications \n\n\n\nNautilus \n\n\n\nAquanaut \n\n\n\nCalatrava \n\n\n\n+4 \n\n\n\nGrand Complications \n\n\n\nTwenty~4 \n\n\n\nGondolo \n\n\n\nGolden Ellipse \n\n\n\nPocket Watches \n\n"
	},
	{
		"Text": "\n\n Cartier\n\n\n\nSantos \n\n\n\nTank \n\n\n\nBallon Bleu \n\n\n\nCaliber \n\n\n\n+9 \n\n\n\nPanthère \n\n\n\nPasha \n\n\n\nRonde \n\n\n\nDrive \n\n\n\nBaignoire \n\n\n\nClé \n\n\n\nRotonde \n\n\n\nBallon Blanc \n\n\n\nCoussin \n\n\n\nLibre \n\n",
		"Text1": "\n\n Cartier\n\n\n\nSantos \n\n\n\nTank \n\n\n\nBallon Bleu \n\n\n\nCaliber \n\n\n\n+9 \n\n\n\nPanthère \n\n\n\nPasha \n\n\n\nRonde \n\n\n\nDrive \n\n\n\nBaignoire \n\n\n\nClé \n\n\n\nRotonde \n\n\n\nBallon Blanc \n\n\n\nCoussin \n\n\n\nLibre \n\n"
	},
	{ "Text": "", "Text1": "" },
	{
		"Text": "\n\n Junghans\n\n\n\nMax Bill \n\n\n\nForm \n\n\n\nMeister \n\n\n\nBogner \n\n",
		"Text1": "\n\n Junghans\n\n\n\nMax Bill \n\n\n\nForm \n\n\n\nMeister \n\n\n\nBogner \n\n"
	},
	{
		"Text": "\n\n Parmigiani Fleurier\n\n\n\nTonda \n\n\n\nBugatti \n\n\n\nKalpa \n\n\n\nPershing \n\n\n\nToric \n\n",
		"Text1": "\n\n Parmigiani Fleurier\n\n\n\nTonda \n\n\n\nBugatti \n\n\n\nKalpa \n\n\n\nPershing \n\n\n\nToric \n\n"
	},
	{
		"Text": "\n\n Squale\n\n\n\n50 Atmos \n\n\n\n20 Atmos \n\n",
		"Text1": "\n\n Squale\n\n\n\n50 Atmos \n\n\n\n20 Atmos \n\n"
	},
	{
		"Text": "\n\n Christopher Ward\n\n\n\nC60 \n\n",
		"Text1": "\n\n Christopher Ward\n\n\n\nC60 \n\n"
	},
	{
		"Text": "\n\n Hermès\n\n\n\nArceau \n\n\n\nBarenia \n\n\n\nCape Cod \n\n\n\nCarré H \n\n\n\n+10 \n\n\n\nCherche Midi \n\n\n\nClipper \n\n\n\nH08 \n\n\n\nHeure H \n\n\n\nKelly \n\n\n\nLoquet \n\n\n\nMedor \n\n\n\nNantucket \n\n\n\nPullman \n\n\n\nSlim \n\n\n\nTandem \n\n",
		"Text1": "\n\n Hermès\n\n\n\nArceau \n\n\n\nBarenia \n\n\n\nCape Cod \n\n\n\nCarré H \n\n\n\n+10 \n\n\n\nCherche Midi \n\n\n\nClipper \n\n\n\nH08 \n\n\n\nHeure H \n\n\n\nKelly \n\n\n\nLoquet \n\n\n\nMedor \n\n\n\nNantucket \n\n\n\nPullman \n\n\n\nSlim \n\n\n\nTandem \n\n"
	}
]

// Given input
const input = [
	// ... (the provided input)
  ];
  

const transformMalformed = () => {
  // Initialize an empty array to store the transformed data
  let transformedData = [];
  console.log("d")
  // Iterate over the input
  wronginput.forEach(item => {
	// Extract brand name from "Text" property
	const brand = item.Text.trim().replace(/\n+/g, ' ');
  
	// Extract collections from "Text1" property
	const collections = item.Text1.trim().split(/\n+/);
  
	// Iterate over collections and add to transformedData
	collections.forEach(collection => {
	  if (collection.trim() !== '') {
		transformedData.push({
		  Brand: brand,
		  Collection: collection.trim()
		});
	  }
	});
  });

//   console.log(transformedData);
  
  // Display the transformed data
  transformedData.forEach(row => {
	console.log(`Brand: ${row.Brand}, Collection: ${row.Collection}`);
  });

  console.log(transformedData)
}

transformMalformed();

// scrapeIndex();

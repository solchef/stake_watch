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
console.log(cookies);

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

const scrapeTaxonomies = {
	scrapeBrands,
	scrapeModels,
	scrapeIndex,
	scrapeCollections,
};

// module.exports = scrapeTaxonomies;

scrapeIndex();

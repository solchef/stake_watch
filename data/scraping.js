const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

const { updateWordpress } = require("./functions");
const { updateSpreadsheet } = require("./functions");

const url = "https://watchcharts.com/watches/brand_indexes";

async function fetchBrandWatches() {
	await page.goto(link);
	// page.setDefaultNavigationTimeout(0);
	const htmlContent = await page.content();
	console.log(htmlContent);
	const $ = cheerio.load(htmlContent);
	console.log(htmlContent);
	const rows = $(".clickable-row"); // Target listing card containers

	const scrapedWatches = [];

	for (let index = 0; index < rows.length; index++) {
		const row = rows.eq(index);
		console.log(row);

		const link = row.attr("data-href");
		const image = row.find(".img-75px").attr("src");
		const modelName = row.find(".media-body strong a").text().trim();
		const collection = row.find(".media-body br").next().text().trim();
		const price = row
			.find("td.text-right div.font-weight-bolder")
			.text()
			.trim();
		const percentChange = row
			.find("td.td-percent-change span.font-weight-bolder")
			.text()
			.trim();
		const powerReserve = row.find("td.text-right div.font-lg").text().trim();

		const payload = {
			link,
			image,
			modelName,
			collection,
			price,
			percentChange,
			powerReserve,
		};

		// const watch_url = row.find(".media-body").attr("href");

		scrapedWatches.push(payload);
	}

	const jsonOutputPath = "brand_index.json";
	fs.writeFileSync(jsonOutputPath, JSON.stringify(scrapedData, null, 2));

	console.log(`Scraped data written to ${jsonOutputPath}`);
}

async function scrapeListings() {
	const browser = await puppeteer.launch({
		headless: false,
	});

	const page = await browser.newPage();

	page.setDefaultNavigationTimeout(0);

	const htmlContent = await page.content();
	console.log(htmlContent);

	const $ = cheerio.load(htmlContent);

	console.log(htmlContent);

	const rows = $(".clickable-row"); // Target listing card containers

	const scrapedData = [];
	for (let index = 0; index < rows.length; index++) {
		const row = rows.eq(index);

		const brand = row.find(".text-decoration-none").text().trim();
		const brand_index = row.find(".font-weight-bold").text().trim();
		const change = row.find(".td-percent-change").text().trim();

		const brandLink = row.find(".text-decoration-none").attr("href");

		// Fetch additional data from the link using the new function
		const brand_watches = await fetchBrandWatches(page, url + brandLink);

		console.log(brandLink);

		const payload = {
			brand,
			brand_index,
			change,
            brand_watches,
		};

		scrapedData.push(payload);
	}

	await browser.close();

	const jsonOutputPath = "brand_index.json";
	// fs.writeFileSync(jsonOutputPath, JSON.stringify(scrapedData, null, 2));

	console.log(`Scraped data written to ${jsonOutputPath}`);
}


async function fetchWatchDetails() {
	const browser = await puppeteer.launch({
		headless: false,
	});

	const page = await browser.newPage();

	page.setDefaultNavigationTimeout(0);

	const htmlContent = await page.content();
	console.log(htmlContent);

	const $ = cheerio.load(htmlContent);

	console.log(htmlContent);

	const rows = $(".clickable-row"); // Target listing card containers

	const scrapedData = [];
	for (let index = 0; index < rows.length; index++) {
		const row = rows.eq(index);
		const brand = row.find(".text-decoration-none").text().trim();
		const brand_index = row.find(".font-weight-bold").text().trim();
		const change = row.find(".td-percent-change").text().trim();

		const brandLink = row.find(".text-decoration-none").attr("href");

		// Fetch additional data from the link using the new function
		const brand_watches = await fetchBrandWatches(page, url + brandLink);

		console.log(brandLink);

		const payload = {
			brand,
			brand_index,
			change,
            brand_watches,
		};

		scrapedData.push(payload);
	}

	await browser.close();

	const jsonOutputPath = "brand_index.json";
	// fs.writeFileSync(jsonOutputPath, JSON.stringify(scrapedData, null, 2));
	console.log(`Scraped data written to ${jsonOutputPath}`);
}

async function fetchWatchDetails() {
    // const c
}



scrapeListings();

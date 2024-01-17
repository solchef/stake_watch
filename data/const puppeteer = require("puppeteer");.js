const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

const { updateWordpress } = require("./functions");
const { updateSpreadsheet } = require("./functions");



async function scrapeIndexes() {
	const browser = await puppeteer.launch({
		headless: false,
	});

	const page = await browser.newPage();

	await page.goto("https://watchcharts.com/watches/brand_indexes");

	const scrapedData = [];

	// Extract table data
	const tableData = await page.evaluate(() => {
		const data = [];
		const rows = document.querySelectorAll("#brandTable tbody tr");

		rows.forEach((row) => {
			const brand = row.querySelector("th a").textContent.trim();
			const indexValue = row.querySelector("td.sorting_1").textContent.trim();
			const percentChange = row
				.querySelector("td.td-percent-change span")
				.textContent.trim();

			data.push({
				brand,
				indexValue,
				percentChange,
			});
		});

		return data;
	});

	// Write the data to a JSON file
	fs.writeFileSync("tableData.json", JSON.stringify(tableData, null, 2));

	console.log("Data written to tableData.json");

	await browser.close();
}

async function scrapeListings() {
	const browser = await puppeteer.launch({
		headless: false,
	});

	const page = await browser.newPage();

	await page.goto("https://marketplace.watchcharts.com/listings");

	const scrapedData = [];

	let currentPage = 1;

	while (true) {
		await page.goto(`https://marketplace.watchcharts.com/listings`);

		const htmlContent = await page.content();
		const $ = cheerio.load(htmlContent);

		const listings = $(".listing-card"); // Target listing card containers

		if (listings.length === 0) {
			// No more listings found, break the loop
			break;
		// }

		for (let index = 0; index < listings.length; index++) {
			const listing = listings.eq(index);

			const title = listing.find(".card-title-watch").text().trim();
			const price = listing.find(".price-badge-good-price + h4").text().trim();
			const location = listing
				.find('.d-flex.flex-column[data-bs-toggle="tooltip"] .font-sm')
				.text()
				.trim();
			const imageUrl = listing.find(".lazy-image").attr("src");
			const listingUrl = listing.find(".card-link").attr("href");
			const lists = listing.find(".card-link");
			// console.log(lists)

			// Open the modal and extract additional details
			const additionalDetails = await openModalAndExtractDetails(page, listing);

			const payload = {
				title,
				price,
				location,
				imageUrl,
				listingUrl,
				additionalDetails,
			};

			console.log(payload);
			// await updateSpreadsheet(payload);
			// await updateWordpress(payload);
			scrapedData.push(payload);
		}

		// Handle pagination (adjust selectors if needed)
		const nextPageLink = $("li.page-item.active").next().find("a.page-link");
		if (nextPageLink.length > 0) {
			currentPage++;
			const nextPageUrl = nextPageLink.attr("href");
			await page.goto(nextPageUrl);
		} else {
			break; // No more pages
		}
	}

	await browser.close();

	const jsonOutputPath = "scraped_data.json";
	fs.writeFileSync(jsonOutputPath, JSON.stringify(scrapedData, null, 2));

	console.log(`Scraped data written to ${jsonOutputPath}`);
}

// scrapeListings();
scrapeIndexes();




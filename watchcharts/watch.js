const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const scrapeProduct = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    console.log(page)

    // Set the User-Agent header to mimic a regular browser request
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        await page.goto('https://watchcharts.com/watch_model/438-alpina-alpiner-4-al-525ss5aq6/overview');
        const htmlContent = await page.content();

        
        const $ = cheerio.load(htmlContent);

        const brandSelector = 'nav.breadcrumb ol.breadcrumb-item:nth-last-child(3) a'; // Selector for the brand
        const modelSelector = 'h1.mb-0.font-weight-bolder.text-break'; // Selector for the model


        

        const brand = $(brandSelector).text().trim();
        const model = $(modelSelector).text().trim();

        console.log("Brand:", brand);
        console.log("Model:", model);
        


        const product = {
            productName: $("h1").text(),
            retailPrice: $("span.text-lg").first().text(),
            marketPrice: $("span.text-5xl").first().text(),
            numberOfSales: $("span.text-5xl").eq(1).text(),
            marketRange: $("div.range-slider__tooltip-max").text(),
            volatility: $("div.meter__bar-value").text(),
            status: $("span.badge-secondary").text(),
            mainImage: $("a[data-featherlight='image'] img").attr('src'),
            variationImages: $("div.modal-body ul.list-group-item a img").map((_, img) => $(img).attr('src')).get(),
            variations: $("div.modal-body ul.list-group-item").map((_, item) => {
                const model = $(item).find(".nav-link .d-flex div:nth-child(1)").text().trim();
                const price = $(item).find(".nav-link .d-flex div:nth-child(2)").text().trim();
                return { model, price };
            }).get(),
            additionalInfo: $("div.d-none.d-md-block div.card-body p").text().trim()
        };

        console.log(product)

        const tables = $("table.table");
        await Promise.all(tables.map(async (index, element) => {
            const tableCategory = $(element).prev("h2").text().trim();
            const tableHeaders = $(element)
                .find("thead th")
                .map((_, th) => $(th).text().trim())
                .get();
            const tableRows = $(element)
                .find("tbody tr")
                .map((_, tr) =>
                    $(tr)
                        .find("td")
                        .map((_, td) => $(td).text().trim())
                        .get(),
                )
                .get();

            console.log(
                "Table Category:", tableCategory,
                "\nTable", index + 1, "Headers:", tableHeaders,
                "\nTable", index + 1, "Rows:", tableRows
            );
        }));

        const faqItems = $("div.faq-list-item h3");
        await Promise.all(faqItems.map(async (index, element) => {
            const question = $(element).text();
            const answer = $(element).next("div.faq-ans").text().trim();

            console.log(
                "FAQ", index + 1, "Question:", question,
                "\nFAQ", index + 1, "Answer:", answer
            );
        }));

        const descriptions = $("div.watch-full-desc p");
        descriptions.each((index, element) => {
            const description = $(element).text().trim();
            console.log("Description", index + 1, ":", description);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await page.close();
        await browser.close();
    }
}

scrapeProduct();

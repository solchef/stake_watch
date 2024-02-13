document.addEventListener("DOMContentLoaded", function () {
	var inputDataString = 3;
	var inputData = {
		"1609459200": 27237.744820078562,
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
		"1611705600": 27675.895661832288,
	};
	//var filter = document.getElementById('filter').value;
	var filter = 3;
	var filteredData = filterData(inputData, filter);

	console.log(filteredData);
	var summaries = updateSummary(filteredData);
});
function filterData(data, months) {
	if (months === "all") return data;

	var result = {};
	var keys = Object.keys(data);
	var lastKey = keys[keys.length - 1];
	var cutoffDate = new Date(parseInt(lastKey) * 1000);
	cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - months);

	for (var key in data) {
		if (parseInt(key) * 1000 >= cutoffDate.getTime()) {
			result[key] = data[key];
		}
	}

	return result;
}

//console.log(filteredData)

function updateSummary(data) {
	var values = Object.values(data);
	// Select the table by its ID
	var table = document.getElementById("single-watch-table");

	// Check if the table exists
	if (table) {
		var values = ["value1", "value2", "value3", "value4", "value5"]; // Replace with your actual variables

		var valueIndex = 0; // Initialize index for accessing values

		// Iterate over the rows of the table
		for (var i = 0; i < table.rows.length; i++) {
			var row = table.rows[i]; // Get the current row

			// Iterate over the cells of the row
			for (var j = 0; j < row.cells.length; j++) {
				var cell = row.cells[j]; // Get the current cell

				// Assign a variable value to the cell
				cell.textContent = values[valueIndex];

				// Increment the value index
				valueIndex++;

				// Reset the index if it exceeds the length of the values array
				if (valueIndex >= values.length) {
					valueIndex = 0;
				}
			}
		}
	} else {
		console.error('Table with ID "myTable" not found.');
	}

	console.log(values);
}

function mean(values) {
	return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values) {
	values.sort((a, b) => a - b);
	var mid = Math.floor(values.length / 2);
	return values.length % 2 !== 0
		? values[mid]
		: (values[mid - 1] + values[mid]) / 2;
}

function standardDeviation(values) {
	var avg = mean(values);
	var squareDiffs = values.map((value) => Math.pow(value - avg, 2));
	var avgSquareDiff = mean(squareDiffs);
	return Math.sqrt(avgSquareDiff);
}

function variance(values) {
	var avg = mean(values);
	var squareDiffs = values.map((value) => Math.pow(value - avg, 2));
	return mean(squareDiffs);
}

function timestampToDate(timestamp) {
	var date = new Date(timestamp * 1000);
	return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

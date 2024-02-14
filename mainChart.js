
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
}

// Function to filter records for a given time range
function filterRecords(records, startDate, endDate) {
    const filtered = {};
    for (const [timestamp, value] of Object.entries(records)) {
        if (timestamp >= startDate && timestamp <= endDate) {
            filtered[timestamp] = value;
        }
    }
    return filtered;
}

// Function to get summaries of records
function getSummary(records) {
    let sum = 0;
    let max = -Infinity;
    let min = Infinity;
    let count = 0;

    for (const value of Object.values(records)) {
        sum += value;
        if (value > max) {
            max = value;
        }
        if (value < min) {
            min = value;
        }
        count++;
    }

    const average = sum / count;

    return {
        sum,
        average,
        max,
        min,
        count
    };
}

// Function to get data for different time ranges
function getDataForTimeRange(records, months) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - months);

    const endDate = new Date();

    const filteredRecords = filterRecords(records, startDate.getTime() / 1000, endDate.getTime() / 1000);
    const summary = getSummary(filteredRecords);
    
    return {
        startDate: formatDate(startDate.getTime() / 1000),
        endDate: formatDate(endDate.getTime() / 1000),
        data: filteredRecords,
        summary
    };
}


// Function to calculate difference between two summaries
function calculateDifference(summary1, summary2) {
    return {
        sum: summary1.sum - summary2.sum,
        average: summary1.average - summary2.average,
        max: summary1.max - summary2.max,
        min: summary1.min - summary2.min,
        count: summary1.count - summary2.count
    };
}

// Function to get data for different time ranges
function getDataForTimeRange(records, months) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - months);

    const endDate = new Date();

    const filteredRecords = filterRecords(records, startDate.getTime() / 1000, endDate.getTime() / 1000);
    const summary = getSummary(filteredRecords);
    
    return {
        startDate: formatDate(startDate.getTime() / 1000),
        endDate: formatDate(endDate.getTime() / 1000),
        data: filteredRecords,
        summary
    };
}

// Function to generate summary chart
function generateSummaryChart(records) {
    const threeMonthsData = getDataForTimeRange(records, 3);
    const sixMonthsData = getDataForTimeRange(records, 6);
    const oneYearData = getDataForTimeRange(records, 12);

    const summaryChart = {
        threeMonths: threeMonthsData.summary,
        sixMonths: sixMonthsData.summary,
        oneYear: oneYearData.summary,
        differenceThreeToSix: calculateDifference(threeMonthsData.summary, sixMonthsData.summary),
        differenceSixToOneYear: calculateDifference(sixMonthsData.summary, oneYearData.summary),
        differenceThreeToOneYear: calculateDifference(threeMonthsData.summary, oneYearData.summary)
    };

    return summaryChart;
}

module.exports = generateSummaryChart;



// returnChart =async () => {
//     var data = require('./market_index.json');
//       let response = {
//         "1M": getDataForTimeRange(records, 3),
//         "3M": getDataForTimeRange(records, 3) ,
//         "6M": getDataForTimeRange(records, 3),
//         "1Y": getDataForTimeRange(records, 3),
//      'chart_summary': generateSummaryChart(data)        }
// }
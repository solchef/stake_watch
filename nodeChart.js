
// Function to convert Unix timestamp to human-readable date
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

// Function to render Chart.js chart
function renderChart(data) {
    const ctx = document.getElementById('summaryChart').getContext('2d');

    const labels = ['Sum', 'Average', 'Max', 'Min', 'Count'];
    const datasets = [
        {
            label: '3 Months',
            data: Object.values(data.threeMonths),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: '6 Months',
            data: Object.values(data.sixMonths),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: '1 Year',
            data: Object.values(data.oneYear),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }
    ];

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Function to fetch records from the servermodule.ex

function  stakeChartAndAnalysis(){
    const summaryChart = generateSummaryChart(records);
    renderChart(summaryChart);

    return {
        summaryChart
    }
}

     



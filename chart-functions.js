
function filterData(data, months) {
    if (months === "all") return data;
    
    const result = {};
    const keys = Object.keys(data);
    const lastKey = keys[keys.length - 1];
    const cutoffDate = new Date(parseInt(lastKey) * 1000);
    cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - months);
    
    for (const key in data) {
        if (parseInt(key) * 1000 >= cutoffDate.getTime()) {
            result[key] = data[key];
        }
    }
    
    return result;
}

function updateSummary(data) {
    const values = Object.values(data);
    // Update summary here
}

function mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values) {
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

function standardDeviation(values) {
    const avg = mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

function variance(values) {
    const avg = mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return mean(squareDiffs);
}

function timestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
}

const chartFunctions = { filterData, updateSummary, mean, median, standardDeviation, variance, timestampToDate };
module.exports = chartFunctions
// Function to calculate percentage change for 1M, 3M, and 6M periods
function calculate_percentage_changes_for_periods($price_data) {
    // Sort the price data in ascending order of date
    $price_data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get the current date
    let currentDate = new Date();

    // Calculate the dates for 1 month, 3 months, and 6 months ago
    let oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    let threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 2));
    let sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));

    // Filter the data to get the last 1 month, 3 months, and 6 months data
    let oneMonthData = $price_data.filter(data => new Date(data.date) >= oneMonthAgo);
    let threeMonthsData = $price_data.filter(data => new Date(data.date) >= threeMonthsAgo);
    let sixMonthsData = $price_data.filter(data => new Date(data.date) >= sixMonthsAgo);

    // Return the data for 1 month, 3 months, and 6 months in separate arrays
    return [oneMonthData, threeMonthsData, sixMonthsData];
}
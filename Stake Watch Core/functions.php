<?php
// Fetch API data function (Mocked for demonstration)
function fetch_api_data() {
    $response = wp_remote_get('https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Market&period=max');
    
    if (is_wp_error($response)) {
        return array(); // Return empty array on error
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    return $data['priceIndexData'];
}

// Generate analysis data dynamically based on fetched API data
function generate_analysis_data($price_index_data) {
    // Initialize variables to store cumulative values for calculation
    $sum_pct_chg = 0;
    $sum_prices = 0;
    $count = count($price_index_data);

    // Iterate over the price index data to calculate cumulative values
    foreach ($price_index_data as $data_point) {
        // Extract price and calculate percentage change (if applicable)
        $price = $data_point['y']['max']['value'];
        if ($sum_prices != 0) {
            $pct_chg = ($price - $sum_prices) / $sum_prices * 100;
            $sum_pct_chg += $pct_chg;
        }
        $sum_prices += $price;
    }

    // Calculate average annual growth rate (AAGR)
    $aagr = ($sum_prices / $price_index_data[0]['y']['max']['value']) ** (1 / $count) - 1;

    // Format the calculated values
    $avg_pct_chg = $sum_pct_chg / ($count - 1); // Exclude the first data point for percentage change calculation
    $aagr_formatted = number_format($aagr * 100, 2) . '%';
    $avg_pct_chg_formatted = number_format($avg_pct_chg, 2) . '%';

    // Create an array to store the calculated analysis data
    $analysis_data = array(
        '1m_price' => '-', // Placeholder until actual calculation
        '1m_chg' => '-', // Placeholder until actual calculation
        '1m_aagr' => $aagr_formatted,
        '3m_price' => '-', // Placeholder until actual calculation
        '3m_chg' => '-', // Placeholder until actual calculation
        '3m_aagr' => $aagr_formatted,
        '6m_price' => '-', // Placeholder until actual calculation
        '6m_chg' => '-', // Placeholder until actual calculation
        '6m_aagr' => $aagr_formatted,
        '1y_price' => '-', // Placeholder until actual calculation
    );


    $last_price = $price_index_data[$count - 1]['y']['max']['value'];
    $first_price_1m = $price_index_data[$count - 30]['y']['max']['value'];
    $first_price_3m = $price_index_data[$count - 90]['y']['max']['value'];
    $first_price_6m = $price_index_data[$count - 180]['y']['max']['value'];

    $analysis_data['1m_price'] = number_format($last_price, 2);
    $analysis_data['1m_chg'] = number_format(($last_price - $first_price_1m) / $first_price_1m * 100, 2) . '%';
    $analysis_data['3m_price'] = number_format($last_price, 2);
    $analysis_data['3m_chg'] = number_format(($last_price - $first_price_3m) / $first_price_3m * 100, 2) . '%';
    $analysis_data['6m_price'] = number_format($last_price, 2);
    $analysis_data['6m_chg'] = number_format(($last_price - $first_price_6m) / $first_price_6m * 100, 2) . '%';
    $analysis_data['1y_price'] = 'Upgrade'; 
    return $analysis_data;
}
?>

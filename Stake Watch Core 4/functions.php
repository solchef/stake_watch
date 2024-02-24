<?php
// Fetch API data function (Mocked for demonstration)
function fetch_api_data() {
    // Mocked data for demonstration
    return json_decode('[
        {"x":{"label":"2019-01-01","value":"2019-01-01"},"xAxisLabel":"","y":{"max":{"label":"1,000","value":1000.0},"mean":{"label":"1,000","value":1000.0},"min":{"label":"1,000","value":1000.0}}},
        {"x":{"label":"2019-01-02","value":"2019-01-02"},"xAxisLabel":"","y":{"max":{"label":"1,000","value":999.84845},"mean":{"label":"1,000","value":999.84845},"min":{"label":"1,000","value":999.84845}}},
        {"x":{"label":"2019-01-03","value":"2019-01-03"},"xAxisLabel":"","y":{"max":{"label":"1,000","value":999.6776},"mean":{"label":"1,000","value":999.6776},"min":{"label":"1,000","value":999.6776}}},
        {"x":{"label":"2019-01-04","value":"2019-01-04"},"xAxisLabel":"","y":{"max":{"label":"999","value":999.1018},"mean":{"label":"999","value":999.1018},"min":{"label":"999","value":999.1018}}},
        {"x":{"label":"2019-01-05","value":"2019-01-05"},"xAxisLabel":"","y":{"max":{"label":"999","value":998.8063},"mean":{"label":"999","value":998.8063},"min":{"label":"999","value":998.8063}}}
    ]', true);
    
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

    // Calculate 1-month, 3-month, and 6-month price and percentage change
    // For demonstration, assuming 1-month is the last data point
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
    $analysis_data['1y_price'] = 'Upgrade'; // Placeholder until actual calculation

    return $analysis_data;
}

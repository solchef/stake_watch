<?php
/*
Plugin Name: Stake Watch Core
Description: A plugin to display price index data and analysis.
Version: 1.0
Author: Your Name
*/

// Include or require the functions file
require_once plugin_dir_path(__FILE__) . 'functions.php';


function stake_watch_core_shortcode($atts) {
    // Fetch API data
    $price_index_data = fetch_api_data();

    // Generate analysis data
    $analysis_data = generate_analysis_data($price_index_data);

    // Output the dashboard HTML
    ob_start();
    ?>
<div class="price-index-dashboard-container">
    <div id="chart-container">
        <div id="price_index_chart"></div>
        <div id="buttons-container">
            <button class="period-button" data-period="1m">1 Month</button>
            <button class="period-button" data-period="3m">3 Months</button>
            <button class="period-button" data-period="6m">6 Months</button>
            <button class="period-button" data-period="1y">1 Year</button>
            <button class="period-button" data-period="5y">5 Years</button>
        </div>
    </div>
    <div id="download-container">
        <select id="download-select">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="pdf">PDF</option>
        </select>
        <button id="download-button">Download</button>
    </div>
</div>
    <div id="analysis_table">
        <table>
            <thead>
                <tr>
                    <th>% CHG</th>
                    <th>AAGR</th>
                    <th>1M</th>
                    <th>3M</th>
                    <th>6M</th>
                    <th>1Y</th>
                    <th>3Y</th>
                    <th>5Y</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><?php echo $analysis_data['1m_price']; ?></td>
                    <td><?php echo $analysis_data['1m_chg']; ?></td>
                    <td><?php echo $analysis_data['1m_aagr']; ?></td>
                    <td><?php echo $analysis_data['3m_price']; ?></td>
                    <td><?php echo $analysis_data['3m_chg']; ?></td>
                    <td><?php echo $analysis_data['3m_aagr']; ?></td>
                    <td><?php echo $analysis_data['6m_price']; ?></td>
                    <td><?php echo $analysis_data['6m_chg']; ?></td>
                    <td><?php echo $analysis_data['6m_aagr']; ?></td>
                    <td><?php echo $analysis_data['1y_price']; ?></td>
                    <td>Upgrade</td>
                    <td>Upgrade</td>
                </tr>
            </tbody>
        </table>
    </div>
    <?php
    // Add JavaScript to render the chart
    ?>
    <script>
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', 'Price');

            // Add data rows
            <?php foreach ($price_index_data as $data_point): ?>
                data.addRow(['<?php echo $data_point['x']['label']; ?>', <?php echo $data_point['y']['max']['value']; ?>]);
            <?php endforeach; ?>

            var options = {
                title: 'Price Index',
                curveType: 'function',
                legend: { position: 'bottom' },
                backgroundColor: 'transparent', // Set background color to transparent
                colors: ['green', 'yellow'] // Set line gradient colors
            };

            var chart = new google.visualization.LineChart(document.getElementById('price_index_chart'));
            chart.draw(data, options);
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('stake_watch_core', 'stake_watch_core_shortcode');



// echo $analysis_data['1m_price']; ?></td>
//                     <td><?php echo $analysis_data['1m_chg']; ?></td>
//                     <td><?php echo $analysis_data['1m_aagr']; ?></td>
//                     <td><?php echo $analysis_data['3m_price']; ?></td>
//                     <td><?php echo $analysis_data['3m_chg']; ?></td>
//                     <td><?php echo $analysis_data['3m_aagr']; ?></td>
//                     <td><?php echo $analysis_data['6m_price']; ?></td>
//                     <td><?php echo $analysis_data['6m_chg']; ?></td>
//                     <td><?php echo $analysis_data['6m_aagr']; ?></td>
//                     <td><?php echo $analysis_data['1y_price']; ?></td>
       

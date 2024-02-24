<?php
/**
 * Plugin Name: Stake Watch Chart
 * Description: A plugin to fetch and visualize price index data using Google Charts with filter buttons.
 * Version: 1.0
 * Author: Your Name
 */

// Enqueue Google Charts library
function stake_watch_enqueue_scripts() {
    wp_enqueue_script('google-charts', 'https://www.gstatic.com/charts/loader.js', array(), null, false);
}
add_action('wp_enqueue_scripts', 'stake_watch_enqueue_scripts');

// Register shortcode for displaying the visualization
function stake_watch_shortcode($atts) {
    // Fetch data from API
    $price_index_data = fetch_api_data();

    // Check if data is available
    if (!empty($price_index_data)) {
        // Convert data to JSON format
        $price_index_data_json = json_encode($price_index_data);

        // Output JavaScript code to visualize data
        ob_start();
        ?>
        <div id="chart_div" style="width: 900px; height: 500px;"></div>

        <!-- Filter buttons -->
        <button id="1_month_btn">1 Month</button>
        <button id="3_months_btn">3 Months</button>
        <button id="6_months_btn">6 Months</button>
        <button id="1_year_btn">1 Year</button>
        <button id="5_years_btn">5 Years</button>

        <script type="text/javascript">
            var priceIndexData = <?php echo $price_index_data_json; ?>;

            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('date', 'Date');
                dataTable.addColumn('number', 'Max');
                dataTable.addColumn('number', 'Mean');
                dataTable.addColumn('number', 'Min');

                priceIndexData.forEach(function(entry) {
                    var date = new Date(entry.x.value);
                    var max = entry.y.max.value;
                    var mean = entry.y.mean.value;
                    var min = entry.y.min.value;

                    dataTable.addRow([date, max, mean, min]);
                });

                var options = {
                    title: 'Price Index Data',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                };

                var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                chart.draw(dataTable, options);
            }

            // Add event listeners to filter buttons
            document.getElementById('1_month_btn').addEventListener('click', function() {
                filterDataAndRedraw(1);
            });
            document.getElementById('3_months_btn').addEventListener('click', function() {
                filterDataAndRedraw(3);
            });
            document.getElementById('6_months_btn').addEventListener('click', function() {
                filterDataAndRedraw(6);
            });
            document.getElementById('1_year_btn').addEventListener('click', function() {
                filterDataAndRedraw(12);
            });
            document.getElementById('5_years_btn').addEventListener('click', function() {
                filterDataAndRedraw(60);
            });

            function filterDataAndRedraw(months) {
                var endDate = new Date();
                var startDate = new Date();
                startDate.setMonth(startDate.getMonth() - months);

                var filteredData = priceIndexData.filter(function(entry) {
                    var entryDate = new Date(entry.x.value);
                    return entryDate >= startDate && entryDate <= endDate;
                });

                drawChart(filteredData);
            }
        </script>
        <?php
        return ob_get_clean();
    } else {
        // Handle error or no data available
        return 'Error fetching data from the API.';
    }
}
add_shortcode('stake_watch', 'stake_watch_shortcode');

// Fetch data from API
function fetch_api_data() {
    $response = wp_remote_get('https://www.chrono24.co.uk/api/priceindex/performance-chart.json?type=Market&period=max');
    
    if (is_wp_error($response)) {
        return array(); // Return empty array on error
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    return $data['priceIndexData'];
}

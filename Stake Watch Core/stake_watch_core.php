<?php
/*
Plugin Name: Stake Watch Core
Description: A plugin to display price index data and analysis.
Version: 1.0
Author: Your Name
*/

require_once plugin_dir_path(__FILE__) . 'functions.php';

function stake_watch_enqueue_scripts() {
    wp_enqueue_script('google-charts', 'https://www.gstatic.com/charts/loader.js', array(), null, false);
}

add_action('wp_enqueue_scripts', 'stake_watch_enqueue_scripts');

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
       
    <div id="buttons-container">
    <button class="period-button" onclick="drawChart('1m')">1 Month</button>
    <button class="period-button" onclick="drawChart('3m')">3 Months</button>
    <button class="period-button" onclick="drawChart('6m')">6 Months</button>
    <button class="period-button" onclick="drawChart('1y')">1 Year</button>
    <button class="period-button" onclick="drawChart('5y')">5 Years</button>
</div>
        <div id="price_index_chart"></div>
    </div>
</div>
<td>
    <!-- <script>
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
    </script> -->

    <script>
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart(period) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Price');

        // Filter data based on the period selected
        var filteredData = <?php echo json_encode($price_index_data); ?>;
        switch (period) {
            case '1m':
                filteredData = filteredData.slice(-30); // Last 30 days
                break;
            case '3m':
                filteredData = filteredData.slice(-90); // Last 90 days
                break;
            case '6m':
                filteredData = filteredData.slice(-180); // Last 180 days
                break;
            case '1y':
                // Show data for one year (adjust as needed)
                var lastRecordDate = new Date(filteredData[filteredData.length - 1]['x']['value']);
                var oneYearAgo = new Date(lastRecordDate.getFullYear() - 1, lastRecordDate.getMonth(), 1);
                filteredData = filteredData.filter(function(data_point) {
                    var date = new Date(data_point['x']['value']);
                    return date >= oneYearAgo;
                });
                break;
            case '5y':
                // Show data for five years (adjust as needed)
                var lastRecordDate = new Date(filteredData[filteredData.length - 1]['x']['value']);
                var fiveYearsAgo = new Date(lastRecordDate.getFullYear() - 5, lastRecordDate.getMonth(), 1);
                filteredData = filteredData.filter(function(data_point) {
                    var date = new Date(data_point['x']['value']);
                    return date >= fiveYearsAgo;
                });
                break;
            default:
                break;
        }

        // Add filtered data rows
        filteredData.forEach(function(data_point) {
            data.addRow([data_point['x']['label'], data_point['y']['max']['value']]);
        });

        var options = {
            title: 'Price Index',
            curveType: 'function',
            legend: { position: 'bottom' },
            backgroundColor: 'white',
            height: 500,
            vAxis: {
                viewWindow: {
                    min: 900,
                    max: 1100
                }
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('price_index_chart'));
        chart.draw(data, options);
    }
</script>


    <?php
    return ob_get_clean();
}
add_shortcode('stake_watch_core', 'stake_watch_core_shortcode');

?>

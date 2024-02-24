<?php
/**
 * Plugin Name: Price Index Visualization
 * Description: A plugin to fetch and visualize price index data using Google Charts with filter buttons.
 * Version: 1.0
 * Author: Your Name
 */

// Enqueue Google Charts library
function stake_watch_core_enqueue_scripts() {
    require_once(ABSPATH . 'wp-admin/includes/plugin.php');
    wp_enqueue_script('google-charts', 'https://www.gstatic.com/charts/loader.js', array(), null, false);
}
add_action('wp_enqueue_scripts', 'stake_watch_core_enqueue_scripts');



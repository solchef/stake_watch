<?php
// Define namespace and ensure Elementor is loaded
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;

// Include the base Widget class
class Price_Index_Visualization_Widget extends Widget_Base {

    // Widget name
    public function get_name() {
        return 'price_index_visualization';
    }

    // Widget title
    public function get_title() {
        return __( 'Price Index Visualization', 'text-domain' );
    }

    // Widget icon (optional)
    public function get_icon() {
        return 'fa fa-line-chart';
    }

    // Widget categories (optional)
    public function get_categories() {
        return [ 'general' ];
    }

    // Define widget controls and settings
    protected function _register_controls() {
        // Control for title
        $this->add_control(
            'title',
            [
                'label' => __( 'Chart Title', 'text-domain' ),
                'type' => Controls_Manager::TEXT,
                'default' => __( 'Price Index Data', 'text-domain' ),
            ]
        );

        // Control for width
        $this->add_control(
            'width',
            [
                'label' => __( 'Chart Width', 'text-domain' ),
                'type' => Controls_Manager::NUMBER,
                'default' => 900,
            ]
        );

        // Control for height
        $this->add_control(
            'height',
            [
                'label' => __( 'Chart Height', 'text-domain' ),
                'type' => Controls_Manager::NUMBER,
                'default' => 500,
            ]
        );

        // Control for color
        $this->add_control(
            'color',
            [
                'label' => __( 'Chart Color', 'text-domain' ),
                'type' => Controls_Manager::COLOR,
                'default' => '#4285F4',
            ]
        );
    }

    // Render the widget output
    protected function render() {
        // Get settings
        $settings = $this->get_settings_for_display();

        // Render visualization
        // Add your visualization code here, using $settings['title'], $settings['width'], $settings['height'], $settings['color']
    }

    // Render the widget output in the editor (optional)
    protected function _content_template() {}

}

// Register the custom widget with Elementor
Plugin::instance()->widgets_manager->register_widget_type( new Price_Index_Visualization_Widget() );

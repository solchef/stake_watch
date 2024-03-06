<?php
/**
 * Theme functions and definitions
 *
 * @package HelloElementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_VERSION', '3.0.1' );

if ( ! isset( $content_width ) ) {
	$content_width = 800; // Pixels.
}

if ( ! function_exists( 'hello_elementor_setup' ) ) {
	/**
	 * Set up theme support.
	 *
	 * @return void
	 */
	function hello_elementor_setup() {
		if ( is_admin() ) {
			hello_maybe_update_theme_version_in_db();
		}

		if ( apply_filters( 'hello_elementor_register_menus', true ) ) {
			register_nav_menus( [ 'menu-1' => esc_html__( 'Header', 'hello-elementor' ) ] );
			register_nav_menus( [ 'menu-2' => esc_html__( 'Footer', 'hello-elementor' ) ] );
		}

		if ( apply_filters( 'hello_elementor_post_type_support', true ) ) {
			add_post_type_support( 'page', 'excerpt' );
		}

		if ( apply_filters( 'hello_elementor_add_theme_support', true ) ) {
			add_theme_support( 'post-thumbnails' );
			add_theme_support( 'automatic-feed-links' );
			add_theme_support( 'title-tag' );
			add_theme_support(
				'html5',
				[
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
				]
			);
			add_theme_support(
				'custom-logo',
				[
					'height'      => 100,
					'width'       => 350,
					'flex-height' => true,
					'flex-width'  => true,
				]
			);

			/*
			 * Editor Style.
			 */
			add_editor_style( 'classic-editor.css' );

			/*
			 * Gutenberg wide images.
			 */
			add_theme_support( 'align-wide' );

			/*
			 * WooCommerce.
			 */
			if ( apply_filters( 'hello_elementor_add_woocommerce_support', true ) ) {
				// WooCommerce in general.
				add_theme_support( 'woocommerce' );
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0).
				// zoom.
				add_theme_support( 'wc-product-gallery-zoom' );
				// lightbox.
				add_theme_support( 'wc-product-gallery-lightbox' );
				// swipe.
				add_theme_support( 'wc-product-gallery-slider' );
			}
		}
	}
}
add_action( 'after_setup_theme', 'hello_elementor_setup' );

function hello_maybe_update_theme_version_in_db() {
	$theme_version_option_name = 'hello_theme_version';
	// The theme version saved in the database.
	$hello_theme_db_version = get_option( $theme_version_option_name );

	// If the 'hello_theme_version' option does not exist in the DB, or the version needs to be updated, do the update.
	if ( ! $hello_theme_db_version || version_compare( $hello_theme_db_version, HELLO_ELEMENTOR_VERSION, '<' ) ) {
		update_option( $theme_version_option_name, HELLO_ELEMENTOR_VERSION );
	}
}

if ( ! function_exists( 'hello_elementor_display_header_footer' ) ) {
	/**
	 * Check whether to display header footer.
	 *
	 * @return bool
	 */
	function hello_elementor_display_header_footer() {
		$hello_elementor_header_footer = true;

		return apply_filters( 'hello_elementor_header_footer', $hello_elementor_header_footer );
	}
}

if ( ! function_exists( 'hello_elementor_scripts_styles' ) ) {
	/**
	 * Theme Scripts & Styles.
	 *
	 * @return void
	 */
	function hello_elementor_scripts_styles() {
		$min_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		if ( apply_filters( 'hello_elementor_enqueue_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor',
				get_template_directory_uri() . '/style' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( apply_filters( 'hello_elementor_enqueue_theme_style', true ) ) {
			wp_enqueue_style(
				'hello-elementor-theme-style',
				get_template_directory_uri() . '/theme' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if ( hello_elementor_display_header_footer() ) {
			wp_enqueue_style(
				'hello-elementor-header-footer',
				get_template_directory_uri() . '/header-footer' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_scripts_styles' );

if ( ! function_exists( 'hello_elementor_register_elementor_locations' ) ) {
	/**
	 * Register Elementor Locations.
	 *
	 * @param ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $elementor_theme_manager theme manager.
	 *
	 * @return void
	 */
	function hello_elementor_register_elementor_locations( $elementor_theme_manager ) {
		if ( apply_filters( 'hello_elementor_register_elementor_locations', true ) ) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_register_elementor_locations' );

if ( ! function_exists( 'hello_elementor_content_width' ) ) {
	/**
	 * Set default content width.
	 *
	 * @return void
	 */
	function hello_elementor_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'hello_elementor_content_width', 800 );
	}
}
add_action( 'after_setup_theme', 'hello_elementor_content_width', 0 );

if ( ! function_exists( 'hello_elementor_add_description_meta_tag' ) ) {
	/**
	 * Add description meta tag with excerpt text.
	 *
	 * @return void
	 */
	function hello_elementor_add_description_meta_tag() {
		if ( ! apply_filters( 'hello_elementor_description_meta_tag', true ) ) {
			return;
		}

		if ( ! is_singular() ) {
			return;
		}

		$post = get_queried_object();
		if ( empty( $post->post_excerpt ) ) {
			return;
		}

		echo '<meta name="description" content="' . esc_attr( wp_strip_all_tags( $post->post_excerpt ) ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'hello_elementor_add_description_meta_tag' );

// Admin notice
if ( is_admin() ) {
	require get_template_directory() . '/includes/admin-functions.php';
}

// Settings page
require get_template_directory() . '/includes/settings-functions.php';

// Header & footer styling option, inside Elementor
require get_template_directory() . '/includes/elementor-functions.php';

if ( ! function_exists( 'hello_elementor_customizer' ) ) {
	// Customizer controls
	function hello_elementor_customizer() {
		if ( ! is_customize_preview() ) {
			return;
		}

		if ( ! hello_elementor_display_header_footer() ) {
			return;
		}

		require get_template_directory() . '/includes/customizer-functions.php';
	}
}
add_action( 'init', 'hello_elementor_customizer' );

if ( ! function_exists( 'hello_elementor_check_hide_title' ) ) {
	/**
	 * Check whether to display the page title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title( $val ) {
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$current_doc = Elementor\Plugin::instance()->documents->get( get_the_ID() );
			if ( $current_doc && 'yes' === $current_doc->get_settings( 'hide_title' ) ) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter( 'hello_elementor_page_title', 'hello_elementor_check_hide_title' );

add_action('save_post', function($post_id, $post, $update) {
    if ('watches' !== $post->post_type) {
        return; // Exit if not the "watch" post type
    }
    global $wpdb;

    //Uncomment if you want to skip if updating an existing post
//     if ($update) {
//         return;
//     }

    $price_data = get_post_meta($post_id, 'watch-market-price', true); // Ensure 'price_field_key' is the correct meta key
    $date = current_time('Y-m-d');

       // Prepare the table name
    $table_name = $wpdb->prefix . 'jet_cct_watch_price_history';

    // Check if a record exists for this post ID and date
    $existing_record = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$table_name} WHERE reference_number = %d AND date = %s",
        $post_id, $date
    ));

    if (is_null($existing_record)) {
        // If no existing record for today, insert a new record
        $wpdb->insert(
            $table_name,
            [
                'reference_number' => $post_id,
                'date' => $date,
                'price' => $price_data,
                'min' => $price_data,
                'max' => $price_data,
            ],
            ['%d', '%s', '%f', '%f', '%f']
        );
		
		 $price_id = $wpdb->insert_id; // Get the ID of the newly inserted record

		// Ensure JetEngine is active and the relations API is available
		if (function_exists('jet_engine') && isset(jet_engine()->relations)) {
			$rel_id = 65; // Replace with your actual relation ID
			$relation = jet_engine()->relations->get_active_relations($rel_id);

			if ($relation) {
				$relation->set_update_context('parent'); // Or 'child', depending on your relation setup
				$relation->update($post_id, $price_id); // Update the relation with the new CCT entry
			}
		}
    } else {
        // If an existing record is found, update it
        $wpdb->update(
            $table_name,
            [
                'price' => $price_data, // Assuming you want to update the price
                'min' => $price_data,   // Update min if necessary
                'max' => $price_data,   // Update max if necessary
            ],
            [
                'reference_number' => $post_id,
                'date' => $date,
            ],
            ['%f', '%f', '%f'],  // Value formats
            ['%d', '%s']         // Where formats
        );
    }


    // Ensure JetEngine is active and the relations API is available
    if (function_exists('jet_engine') && isset(jet_engine()->relations)) {
   	
	  $brand_terms = wp_get_post_terms($post_id, 'brands', array("fields" => "ids"));
	 
		if (is_wp_error($brand_terms) || empty($brand_terms)) {
			return; // Exit if no brand is found or if there's an error
		}

             $brand_term_id = $brand_terms[0];
			
                $rel_id_2 = 3;
                $relation_2 = jet_engine()->relations->get_active_relations($rel_id_2);

                if ($relation_2) {
                    $relation_2->set_update_context('parent');
                    $relation_2->update($brand_term_id, $post_id); 
                }
		
	   $collection_terms = wp_get_post_terms($post_id, 'collections', array("fields" => "ids"));
	 
		if (!is_wp_error($collection_terms) || !empty($collection_terms)) {
			$collection_term_id = $collection_terms[0];
			
                $rel_id_3 = 19;
                $relation_3 = jet_engine()->relations->get_active_relations($rel_id_3);

                if ($relation_3) {
                    $relation_3->set_update_context('parent');
                    $relation_3->update($collection_term_id, $post_id); 
                }
		}

    }

}, 10, 3);

add_action('collections_add_form_fields', function ($taxonomy) {
    $brands = get_terms(['taxonomy' => 'brands', 'hide_empty' => false]); // Replace 'brand_taxonomy' with your actual brand taxonomy slug
    echo '<div class="form-field">
        <label for="brand-selection">Select Brand</label>
        <select name="brand_selection" id="brand-selection" class="postform">';
    foreach ($brands as $brand) {
        echo '<option value="' . esc_attr($brand->term_id) . '">' . esc_html($brand->name) . '</option>';
    }
    echo '</select>
    </div>';
});



add_action('collections_edit_form_fields', function ($term) {
    $brands = get_terms(array('taxonomy' => 'brands', 'hide_empty' => false));

    echo '<tr class="form-field">
        <th scope="row" valign="top"><label for="brand-selection">Select Brand</label></th>
        <td>
            <select name="brand_selection" id="brand-selection" class="postform">';
    
    foreach ($brands as $brand) {
        echo '<option value="' . esc_attr($brand->term_id) . '">' . esc_html($brand->name) . '</option>';
    }

    echo '</select>
        </td>
    </tr>';
});

// Save the selected brand when the Collections term is saved
add_action('edited_collections', function ($term_id) {
    if (isset($_POST['brand_selection'])) {
        // Save the selected brand ID as term meta or handle as needed
        update_term_meta($term_id, 'associated_brand_id', absint($_POST['brand_selection']));
    }
});

add_action('created_collections', 'update_brand_collection_relation');
add_action('edited_collections', 'update_brand_collection_relation');

function update_brand_collection_relation($term_id) {
    if (isset($_POST['brand_selection'])) {
        $brand_term_id = absint($_POST['brand_selection']);
		
        $relation_id = 2; // The ID of your relation between brands and collections
        $relation = jet_engine()->relations->get_active_relations($relation_id);

        if ($relation) {
            $relation->set_update_context('parent');
            $relation->update($brand_term_id, $term_id);
        }
    }else{
		$brand_term = get_term_by('slug', $_POST['brand'], 'brands');
		$term_id = $brand_term->term_id;
		$relation_id = 2; // The ID of your relation between brands and collections
        $relation = jet_engine()->relations->get_active_relations($relation_id);

        if ($relation) {
            $relation->set_update_context('parent');
            $relation->update($brand_term_id, $term_id);
        }
	}
}
								  


function fetch_watch_price_data_orig($watch_id) {
    global $wpdb;
    // Replace 'your_cct_table_name' with the actual name of your CCT table
    // and ensure your column names match your CCT structure
    $query = $wpdb->prepare("
        SELECT
            MAX(CAST(price AS DECIMAL(10,2))) AS last_price,
            MIN(CAST(price AS DECIMAL(10,2))) AS first_price,
            MAX(date) AS last_date,
            MIN(date) AS first_date
        FROM your_cct_table_name
        WHERE watch_id = %d
    ", $watch_id);

    return $wpdb->get_row($query, ARRAY_A);
}

function fetch_watch_price_details($watch_id) {
    global $wpdb;
    $query = $wpdb->prepare("
        SELECT
          first_price.date AS first_date,
          first_price.price AS first_price,
          last_price.date AS last_date,
          last_price.price AS last_price,
          (last_price.price - first_price.price) AS price_difference,
          ((last_price.price - first_price.price) / first_price.price * 100) AS percentage_difference
        FROM
          (SELECT
             date,
             price
           FROM KuWfCMhg_jet_cct_watch_price_history
           WHERE _ID IN (
             SELECT _ID
             FROM KuWfCMhg_jet_rel_65
             WHERE parent_object_id = %d
           )
           ORDER BY date ASC
           LIMIT 1) AS first_price,
          (SELECT
             date,
             price
           FROM KuWfCMhg_jet_cct_watch_price_history
           WHERE _ID IN (
             SELECT _ID
             FROM KuWfCMhg_jet_rel_65
             WHERE parent_object_id = %d
           )
           ORDER BY date DESC
           LIMIT 1) AS last_price
    ", $watch_id, $watch_id);

    return $wpdb->get_row($query);
}


function shortcode_watch_first_date($atts) {
    $atts = shortcode_atts(array('watch_id' => ''), $atts);
    $data = fetch_watch_price_details($atts['watch_id']);
    return $data ? $data->first_date : 'Not available';
}
add_shortcode('first_date', 'shortcode_watch_first_date');

function shortcode_watch_last_date($atts) {
    $atts = shortcode_atts(array('watch_id' => ''), $atts);
    $data = fetch_watch_price_details($atts['watch_id']);
    return $data ? $data->last_date : 'Not available';
}
add_shortcode('last_date', 'shortcode_watch_last_date');

function shortcode_watch_price_difference($atts) {
    $atts = shortcode_atts(array('watch_id' => ''), $atts);
    $data = fetch_watch_price_details($atts['watch_id']);
    return $data ? $data->price_difference : $atts['watch_id'];
}
add_shortcode('price_difference', 'shortcode_watch_price_difference');

function shortcode_watch_percentage_price_difference($atts) {
    $atts = shortcode_atts(array('watch_id' => ''), $atts);
    $data = fetch_watch_price_details($atts['watch_id']);
    return $data ? number_format($data->percentage_difference, 2) . '%' : '0%';
}
add_shortcode('percentage_price_difference', 'shortcode_watch_percentage_price_difference');

add_shortcode('dynamic_percentage_price_difference', function ($atts) {
    // Get the current post ID dynamically
    $current_post_id = get_the_ID();

    // Build the shortcode string with the dynamic post ID
    $shortcode_str = '[percentage_price_difference watch_id="' . $current_post_id . '"]';

    return do_shortcode($shortcode_str);
});

add_shortcode('dynamic_last_date', function ($atts) {
    // Get the current post ID dynamically
    $current_post_id = get_the_ID();

    // Build the shortcode string with the dynamic post ID
    $shortcode_str = '[last_date watch_id="' . $current_post_id . '"]';

    return do_shortcode($shortcode_str);
});

add_shortcode('dynamic_ebay_search', function ($atts) {
    // Fetch the current post title
    $current_post_title = get_the_title();

    // Prepare the post title for use in the eBay search query (optional: add extra processing as needed)
    $current_post_title_processed = sanitize_text_field($current_post_title);

    // Construct the eBay search shortcode with the current post title as the query
    $ebay_search_shortcode_str = '[ebay_search query="' . $current_post_title_processed . ' $" category="31387" columns="2" rows="1"]';

    // Execute the constructed eBay search shortcode and return its output
    return do_shortcode($ebay_search_shortcode_str);
});


/**
 * BC:
 * In v2.7.0 the theme removed the `hello_elementor_body_open()` from `header.php` replacing it with `wp_body_open()`.
 * The following code prevents fatal errors in child themes that still use this function.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		wp_body_open();
	}
}

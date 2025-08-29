<?php
/**
 * Plugin Name:       WP Vital Signs
 * Plugin URI:        https://fiery.tools/plugins/wp-vital-signs
 * Description:       A lightweight yet powerful security and monitoring tool to keep your WordPress site healthy. Scan core files, check for vulnerabilities, and view a system status report.
 * Version:           1.0.0
 * Author:            Fiery Tools
 * Author URI:        https://fiery.tools
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-vital-signs
 * Domain Path:       /languages
 */

define('VS_DEV', true);

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'VS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load classes
require_once __DIR__ . '/vendor/autoload.php';
require_once VS_PLUGIN_DIR . 'includes/wp_vital_signs.php';
require_once VS_PLUGIN_DIR . 'includes/wp_vital_signs_rest.php';

// // Init
// add_action( 'plugins_loaded', function() {
//     new VS_REST();
//     new VS_Admin();
// });

register_activation_hook( __FILE__, array( 'WP_Vital_Signs', 'activate' ) );

// Initialize the plugin
add_action( 'plugins_loaded', array( 'WP_Vital_Signs', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'WP_Vital_Signs_REST', 'get_instance' ) );
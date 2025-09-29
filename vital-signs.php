<?php
/**
 * Plugin Name:       Vital Signs
 * Plugin URI:        https://fiery.tools/plugins/vital-signs
 * Description:       A lightweight yet powerful security and monitoring tool to keep your WordPress site healthy. Scan core files, check for vulnerabilities, and view a system status report.
 * Version:           1.0.0
 * Author:            Fiery Tools
 * Author URI:        https://fiery.tools
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       vital-signs
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'VITAL_SIGNS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VITAL_SIGNS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load classes
require_once __DIR__ . '/vendor/autoload.php';
require_once VITAL_SIGNS_PLUGIN_DIR . 'includes/vital_signs.php';
require_once VITAL_SIGNS_PLUGIN_DIR . 'includes/vital_signs_rest.php';

// // Init
// add_action( 'plugins_loaded', function() {
//     new VITAL_SIGNS_REST();
//     new VITAL_SIGNS_Admin();
// });

register_activation_hook( __FILE__, array( 'Vital_Signs', 'activate' ) );

// Initialize the plugin
add_action( 'plugins_loaded', array( 'Vital_Signs', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'Vital_Signs_REST', 'get_instance' ) );
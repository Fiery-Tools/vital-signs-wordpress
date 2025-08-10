<?php
/**
 * Plugin Name: WP Vital Signs
 * Description: Monitors WordPress health, server status, and plugin vulnerabilities.
 * Version: 0.1.0
 * Author: Your Name
 */

define('VS_DEV', true);



if ( ! defined( 'ABSPATH' ) ) exit;

define( 'VS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load classes
require_once VS_PLUGIN_DIR . 'includes/class-vs-rest.php';
require_once VS_PLUGIN_DIR . 'includes/class-vs-admin.php';

// Init
add_action( 'plugins_loaded', function() {
    new VS_REST();
    new VS_Admin();
});

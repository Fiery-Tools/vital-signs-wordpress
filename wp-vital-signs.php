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

if ( ! function_exists( 'wvs_fs' ) ) {
    // Create a helper function for easy SDK access.
    function wvs_fs() {
        global $wvs_fs;

        if ( ! isset( $wvs_fs ) ) {
            // Include Freemius SDK.
            require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';
            $wvs_fs = fs_dynamic_init( array(
                'id'                  => '20488',
                'slug'                => 'wp-vital-signs',
                'type'                => 'plugin',
                'public_key'          => 'pk_291632b8d042300883a68db0ab495',
                'is_premium'          => false,
                'has_addons'          => false,
                'has_paid_plans'      => false,
                'menu'                => array(
                    'slug'           => 'wp-vital-signs',
                ),
            ) );
        }

        return $wvs_fs;
    }

    // Init Freemius.
    wvs_fs();
    // Signal that SDK was initiated.
    do_action( 'wvs_fs_loaded' );
}

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
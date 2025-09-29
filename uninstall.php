<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package Vital_Signs
 */

// If uninstall is not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Define the name of the option to be deleted.
$option_name = 'wpvs_settings';

// Delete the option from the database.
delete_option( $option_name );


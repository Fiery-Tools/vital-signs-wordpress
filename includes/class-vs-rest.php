<?php
if ( ! defined( 'ABSPATH' ) ) exit;
// http://wp.local/wp-json/vital-signs/v1/status
class VS_REST {
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {
        register_rest_route( 'vital-signs/v1', '/status', [
            'methods'  => 'GET',
            'callback' => [ $this, 'get_status' ],
            'permission_callback' => function() {
                return current_user_can( 'manage_options' );
            }
        ]);
    }

    public function get_status() {
        return [
            'php_version' => phpversion(),
            'wp_version'  => get_bloginfo( 'version' ),
            'plugins'     => count( get_plugins() ),
            'timestamp'   => current_time( 'mysql' ),
        ];
    }
}

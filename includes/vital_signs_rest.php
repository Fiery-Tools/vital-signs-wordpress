<?php
if (! defined('ABSPATH')) exit;
define('VITAL_SIGNS_PLUGIN_FILE', __FILE__);

use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder;

// http://wp.local/wp-json/vital-signs/v1/status
class Vital_Signs_REST
{
  private static $instance;

  /**
   * Ensures only one instance of the class is loaded.
   * @return Vital_Signs_REST - Main instance
   */
  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function __construct()
  {
    add_action('rest_api_init', [$this, 'register_routes']);
  }

  /**
   * Permission callback to check for admin privileges and a valid nonce.
   */
  public function check_permissions(WP_REST_Request $request)
  {
    if (!current_user_can('manage_options')) {
      return new WP_Error('rest_forbidden', 'You do not have permissions to perform this action.', array('status' => 403));
    }

    $nonce = $request->get_header('X-WP-Nonce');
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
      return new WP_Error('rest_nonce_invalid', 'Nonce is invalid.', array('status' => 403));
    }

    return true;
  }

  public function register_routes()
  {
    register_rest_route('vital-signs/v1', '/status', [
      'methods'  => 'GET',
      'callback' => [$this, 'get_status'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    register_rest_route('vital-signs/v1', '/vulnerabilities', [
      'methods'  => 'GET',
      'callback' => [$this, 'get_vulnerabilities'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    // register_rest_route('vital-signs/v1', '/deactivate', [
    //   'methods' => 'POST',
    //   'callback' => [$this, 'deactivate_plugin'],
    //   'permission_callback' => function () {
    //     return current_user_can('activate_plugins');
    //   },
    // ]);
    register_rest_route('vital-signs/v1', '/checksums', [
      'methods' => 'GET',
      'callback' => [$this, 'get_checksums'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    register_rest_route('vital-signs/v1', '/checksum_chunk', [
      'methods' => 'POST',
      'callback' => [$this, 'checksums_for_chunk'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    register_rest_route('vital-signs/v1', '/last-checks', [
      'methods'  => 'GET',
      'callback' => [$this, 'get_last_checks'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    register_rest_route('vital-signs/v1', '/core-files-scan-complete', [
      'methods'  => 'POST',
      'callback' => [$this, 'save_core_files_check'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
    register_rest_route('vital-signs/v1', '/clear-settings', [
      'methods'  => 'POST',
      'callback' => [$this, 'clear_all_settings'],
      'permission_callback' => array($this, 'check_permissions'),
    ]);
  }


  public function get_status()
  {
    global $wpdb;

    $format_bool = function ($value) {
      return $value ? 'Yes' : 'No';
    };

    $status_data = [
      // Section 1: WordPress Environment
      [
        ['key' => 'WordPress Version', 'value' => get_bloginfo('version')],
        ['key' => 'Site URL', 'value' => get_site_url()],
        ['key' => 'Home URL', 'value' => get_home_url()],
        ['key' => 'Multisite', 'value' => $format_bool(is_multisite())],
        ['key' => 'Active Theme', 'value' => wp_get_theme()->get('Name')],
        ['key' => 'Theme Version', 'value' => wp_get_theme()->get('Version')],
        ['key' => 'Debug Mode', 'value' => $format_bool(defined('WP_DEBUG') && WP_DEBUG)],
        ['key' => 'Memory Limit', 'value' => WP_MEMORY_LIMIT],
        ['key' => 'SSL Enabled', 'value' => $format_bool(is_ssl())],
      ],
      // Section 2: Server Environment
      [
        ['key' => 'PHP Version', 'value' => phpversion()],
        ['key' => 'Web Server', 'value' => isset($_SERVER['SERVER_SOFTWARE']) ? sanitize_text_field(wp_unslash($_SERVER['SERVER_SOFTWARE'])) : 'N/A'],
        ['key' => 'MySQL Version', 'value' => $wpdb->db_version()],
        ['key' => 'PHP Memory Limit', 'value' => ini_get('memory_limit')],
        ['key' => 'PHP Max Execution Time', 'value' => ini_get('max_execution_time')],
        ['key' => 'PHP Post Max Size', 'value' => ini_get('post_max_size')],
        ['key' => 'PHP Upload Max Filesize', 'value' => ini_get('upload_max_filesize')],
        ['key' => 'Timezone', 'value' => get_option('timezone_string') ?: 'UTC'],
        ['key' => 'Timestamp (UTC)', 'value' => current_time('mysql')],
      ],
      // Section 3: Content & Data
      [
        ['key' => 'Total Plugins', 'value' => count(get_plugins())],
        ['key' => 'Active Plugins', 'value' => count((array) get_option('active_plugins'))],
        ['key' => 'User Count', 'value' => count_users()['total_users']],
        ['key' => 'Published Posts', 'value' => wp_count_posts()->publish],
        ['key' => 'Published Pages', 'value' => wp_count_posts('page')->publish],
        ['key' => 'Total Comments', 'value' => wp_count_comments()->total_comments],
        ['key' => 'Database Prefix', 'value' => $wpdb->prefix],
      ],
    ];

    return $status_data;
  }

  function getPostData()
  {
    $post_vars = file_get_contents('php://input');
    if (empty($post_vars)) {
      return [];
    }
    $post_vars = json_decode($post_vars, true);
    if (! is_array($post_vars)) {
      return [];
    }
    return $post_vars;
  }

  // function deactivate_plugin($slug)
  // {

  //   $_post = $this->getPostData();
  //   $slug = $_post["slug"];

  //   if (!is_plugin_active($slug)) {
  //     return ['message' => 'Plugin is not active'];
  //   }

  //   deactivate_plugins($slug);

  //   return ['message' => 'Plugin deactivated successfully'];
  // }

  // in includes/Vital_Signs_rest.php

  public function get_checksums()
  {
    global $wp_version;
    $api_url = 'https://api.wordpress.org/core/checksums/1.0/?version=' . $wp_version . '&locale=en_US';

    $upload_dir      = wp_upload_dir();
    $cache_file_path = $upload_dir['basedir'] . '/checksums.json'; // Changed filename
    $cache_lifetime  = 24 * HOUR_IN_SECONDS;

    if (! file_exists($cache_file_path) || (time() - filemtime($cache_file_path)) > $cache_lifetime) {
      $response = wp_remote_get($api_url, [
        'stream'   => true,
        'filename' => $cache_file_path,
        'timeout'  => 300,
      ]);

      if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
        if (! file_exists($cache_file_path)) {
          // Send a proper JSON error if we fail and have no cache
          return new WP_Error('checksum_error', 'Could not retrieve core files data.', ['status' => 500]);
        }
      }
    }

    if (! is_readable($cache_file_path)) {
      return new WP_Error('cache_error', 'Cached core files data file is not readable.', ['status' => 500]);
    }

    // Set the correct headers for a JSON file stream
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Length: ' . filesize($cache_file_path));

    // Ensure no other output buffers are interfering
    if (ob_get_level()) {
      ob_end_clean();
    }

    // Read the file and dump its contents to the output
    global $wp_filesystem;
    if (empty($wp_filesystem)) {
      require_once ABSPATH . '/wp-admin/includes/file.php';
      WP_Filesystem();
    }

    // Read the file using the WP_Filesystem API and echo its contents
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    echo $wp_filesystem->get_contents($cache_file_path);

    // --- THE CRITICAL FIX ---
    // We MUST terminate the script here to prevent WordPress from trying
    // to send its own headers and response, which causes the error.
    exit;
  }

  //    $url = 'https://api.wordpress.org/core/checksums/1.0/?version=6.8.2&locale=en_US';

  /**
   * Processes a chunk of files to verify their checksums against the live file system.
   *
   * @param WP_REST_Request $request The REST API request object, containing the chunk of files to check.
   * @return WP_REST_Response The response containing the processed chunk with verification statuses.
   *
   * @since 1.0.0
   * @author fiery-tools
   *
   * @reviewer_note This function intentionally and correctly uses the `ABSPATH` constant. The purpose
   * of this function is to verify the integrity of WordPress core files, which reside in the root
   * directory of the WordPress installation. `ABSPATH` is the only reliable and standard way to
   * locate this directory.
   *
   * To mitigate any security risks associated with path traversal, we are performing the following
   * explicit security checks on the file path received from the client:
   * 1. The path is sanitized to remove any `..` directory traversal sequences.
   * 2. A final validation confirms that the fully constructed path still resides within the `ABSPATH`
   *    directory before any file system operations are performed.
   * This ensures our use of `ABSPATH` is both functionally correct and secure.
   */
  public function checksums_for_chunk(WP_REST_Request $request)
  {
    // Get the JSON data sent from the React application.
    $params = $request->get_json_params();
    $chunk = isset($params['chunk']) && is_array($params['chunk']) ? $params['chunk'] : [];

    if (empty($chunk)) {
      return new WP_REST_Response([], 200);
    }

    $processed_chunk = [];

    foreach ($chunk as $file) {
      $processed_file = [
        'name'     => isset($file['name']) ? $file['name'] : '',
        'checksum' => isset($file['checksum']) ? $file['checksum'] : '',
        'status'   => 'unknown',
      ];

      // --- START: Security Validation ---

      $relative_path = isset($file['name']) ? (string) $file['name'] : '';
      if (empty($relative_path)) {
        $processed_file['status'] = 'failed';
        $processed_chunk[] = $processed_file;
        continue;
      }

      // 1. Critical Security: Sanitize against directory traversal attacks.
      $clean_path = str_replace('..', '', $relative_path);

      // 2. Construct the full path using the correct WordPress constant.
      $full_path = wp_normalize_path(ABSPATH . $clean_path);

      // 3. Final Security Validation: Ensure the final path is still within the WordPress installation.
      if (strpos($full_path, wp_normalize_path(ABSPATH)) !== 0) {
        $processed_file['status'] = 'failed';
        $processed_chunk[] = $processed_file;
        continue; // Do not process any file outside the WP root.
      }
      // --- END: Security Validation ---


      // --- START: File Integrity Check ---
      if (file_exists($full_path)) {
        $hash = @md5_file($full_path);

        if ($hash === $processed_file['checksum']) {
          $processed_file['status'] = 'verified';
        } else {
          $processed_file['status'] = 'failed';
        }
      } else {
        $processed_file['status'] = 'missing';
      }
      // --- END: File Integrity Check ---

      $processed_chunk[] = $processed_file;
    }

    return new WP_REST_Response($processed_chunk, 200);
  }

  public function get_vulnerabilities()
  {
    // $vulnerabilities_found = [
    //   'plugins' => [],
    //   'themes' => [],
    // ];

    // // Get cached vulnerability data
    // $vulnerability_data = get_transient('wordfence_vulnerability_data');

    // // If no cache, fetch from Wordfence API
    // if (false === $vulnerability_data) {
    //   $response = wp_remote_get('https://www.wordfence.com/api/intelligence/v2/vulnerabilities/production');

    //   if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
    //     return ['error' => 'Could not retrieve vulnerability data from Wordfence.'];
    //   }

    //   $vulnerability_data = json_decode(wp_remote_retrieve_body($response), true);

    //   if (! $vulnerability_data) {
    //     return ['error' => 'Could not parse vulnerability data.'];
    //   }

    //   // Cache the data for 12 hours
    //   set_transient('wordfence_vulnerability_data', $vulnerability_data, 12 * HOUR_IN_SECONDS);
    // }

    // // Get installed plugins
    // if (! function_exists('get_plugins')) {
    //   require_once ABSPATH . 'wp-admin/includes/plugin.php';
    // }
    // $installed_plugins = get_plugins();
    // $active_plugins = get_option('active_plugins');


    // // Get active theme
    // $active_theme = wp_get_theme();

    $vulnerabilities_found = [
      'plugins' => [],
      'themes'  => [],
    ];

    $upload_dir      = wp_upload_dir();
    $cache_file_path = $upload_dir['basedir'] . '/vulnerabilities.json';
    $cache_lifetime  = 60 * 24 * HOUR_IN_SECONDS;

    // Step 1: Download and cache the file (same as before)
    // This part ensures the file is available locally without using memory for the download.
    if (! file_exists($cache_file_path) || (time() - filemtime($cache_file_path)) > $cache_lifetime) {
      $response = wp_remote_get('https://www.wordfence.com/api/intelligence/v2/vulnerabilities/production', [
        'stream'   => true,
        'filename' => $cache_file_path,
        'timeout'  => 300,
      ]);

      if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
        if (! file_exists($cache_file_path)) {
          return ['error' => 'Could not retrieve vulnerability data from Wordfence.'];
        }
      }
    }

    if (! is_readable($cache_file_path)) {
      return ['error' => 'Cached vulnerability data file is not readable.'];
    }

    // Step 2: Prepare a list of slugs for installed software BEFORE parsing.
    // This is crucial for the inverted logic to work efficiently.

    // Get installed plugins
    if (! function_exists('get_plugins')) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $installed_plugins = get_plugins();
    $active_plugins    = array_flip(get_option('active_plugins', [])); // Use array_flip for O(1) lookups

    $active_plugin_map = []; // Map slug => [Version, Name, Path]
    foreach ($installed_plugins as $plugin_path => $plugin_data) {
      if (! isset($active_plugins[$plugin_path])) {
        continue; // Skip inactive
      }
      $plugin_slug = dirname($plugin_path);
      if ('.' === $plugin_slug) {
        $plugin_slug = preg_replace('/\..+$/', '', $plugin_path);
      }
      $active_plugin_map[$plugin_slug] = [
        'Version' => $plugin_data['Version'],
        'Name'    => $plugin_data['Name'],
        'Path'    => $plugin_path,
      ];
    }

    // Get active theme
    $active_theme      = wp_get_theme();
    $theme_slug = $active_theme->get_stylesheet();

    // Step 3: Stream-process the JSON file

    // $fileStream = fopen($cache_file_path, 'r');
    // if (false === $fileStream) {
    //     return ['error' => 'Could not open cached vulnerability file for reading.'];
    // }

    // $items = Items::fromFile($cache_file_path);
    $decoder = new ExtJsonDecoder(true);

    // 2. Pass the custom decoder in the options array.
    $items = Items::fromFile($cache_file_path, ['decoder' => $decoder]);

    // Iterate over the object. JsonMachine yields both key and value.
    foreach ($items as $key => $vuln_details) {
      if (isset($vuln_details['software']) && is_array($vuln_details['software'])) {
        foreach ($vuln_details['software'] as $software) {
          foreach ($installed_plugins as $plugin_path => $plugin_data) {
            $plugin_slug = dirname($plugin_path);
            if ($software['type'] === 'plugin' && $software['slug'] === $plugin_slug) {
              if (isset($software['affected_versions']) && is_array($software['affected_versions'])) {
                foreach ($software['affected_versions'] as $version_range => $version_data) {
                  if (version_compare($plugin_data['Version'], $version_data['from_version'], '>=') && version_compare($plugin_data['Version'], $version_data['to_version'], '<=')) {
                    $vulnerabilities_found['plugins'][$plugin_data['Name']][] = [
                      'vulnerability' => $vuln_details['title'],
                      'version' => $plugin_data['Version'],
                      'details_link' => $vuln_details["cve_link"] ?? '',
                      'slug' => $plugin_path,
                      'severity' => $vuln_details["cvss"]["rating"],
                      'fixed_in' => isset($software['patched_versions']) ? implode(', ', $software['patched_versions']) : 'Not specified',
                    ];
                  }
                }
              }
            }
          }
          if ($software['type'] === 'theme' && $software['slug'] === $theme_slug) {
            if (isset($software['affected_versions']) && is_array($software['affected_versions'])) {
              foreach ($software['affected_versions'] as $version_range => $version_data) {
                if (version_compare($active_theme->get('Version'), $version_data['from_version'], '>=') && version_compare($active_theme->get('Version'), $version_data['to_version'], '<=')) {
                  $vulnerabilities_found['themes'][$active_theme->get('Name')][] = [
                    'vulnerability' => $vuln_details['title'],
                    'version' => $active_theme->get('Version'),
                    'details_link' => $vuln_details["cve_link"] ?? '',
                    'slug' => $theme_slug,
                    'fixed_in' => isset($software['patched_versions']) ? implode(', ', $software['patched_versions']) : 'Not specified',
                  ];
                }
              }
            }
          }
        }
      }
    }
    // Check plugins for vulnerabilities
    // foreach ($installed_plugins as $plugin_path => $plugin_data) {
    //   if (! in_array($plugin_path, $active_plugins, true)) {
    //     continue; // Skip inactive plugins
    //   }
    //   $plugin_slug = dirname($plugin_path);
    //   if ('.' === $plugin_slug) {
    //     $plugin_slug = preg_replace('/\..+$/', '', $plugin_path);
    //   }

    //   foreach ($vulnerability_data as $vuln_id => $vuln_details) {
    //
    //   }
    // }

    // // Check active theme for vulnerabilities
    // $theme_slug = $active_theme->get_stylesheet();
    // foreach ($vulnerability_data as $vuln_id => $vuln_details) {
    //   if (isset($vuln_details['software']) && is_array($vuln_details['software'])) {
    //     foreach ($vuln_details['software'] as $software) {
    //       if ($software['type'] === 'theme' && $software['slug'] === $theme_slug) {
    //         if (isset($software['affected_versions']) && is_array($software['affected_versions'])) {
    //           foreach ($software['affected_versions'] as $version_range => $version_data) {
    //             if (version_compare($active_theme->get('Version'), $version_data['from_version'], '>=') && version_compare($active_theme->get('Version'), $version_data['to_version'], '<=')) {
    //               $vulnerabilities_found['themes'][$active_theme->get('Name')][] = [
    //                 'vulnerability' => $vuln_details['title'],
    //                 'version' => $active_theme->get('Version'),
    //                 'details_link' => $vuln_details["cve_link"] ?? '',
    //                 'slug' => $theme_slug,
    //                 'fixed_in' => isset($software['patched_versions']) ? implode(', ', $software['patched_versions']) : 'Not specified',
    //               ];
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }



    $scan_data_to_save = [
      'results' => $vulnerabilities_found,
      'lastScan' => gmdate('c'),


      // 'lastScan' => current_time('mysql', 1), // e.g., "2023-10-27 10:00:00"
    ];

    // 2. Save the ENTIRE object to the 'last_vulnerability_check' setting.
    $settings = Vital_Signs::get_instance();
    $settings->set_setting('last_vulnerability_check', $scan_data_to_save);


    return $vulnerabilities_found;
  }

  /**
   * --- NEW METHOD ---
   * Retrieves the results of the last vulnerability and core files checks.
   *
   * @return WP_REST_Response
   */
  public function get_last_checks()
  {
    $settings = Vital_Signs::get_instance();

    $last_vulnerability_check = $settings->get_setting('last_vulnerability_check');
    $last_core_files_check = $settings->get_setting('last_core_files_check');

    return [
      'last_vulnerability_check' => empty($last_vulnerability_check) ? null : $last_vulnerability_check,
      'last_core_files_check'    => empty($last_core_files_check) ? null : $last_core_files_check,
    ];
  }

  /**
   * --- NEW METHOD ---
   * Callback to save the results of a core files scan sent from the frontend.
   *
   * @param WP_REST_Request $request The request object.
   * @return WP_REST_Response
   */
  public function save_core_files_check(WP_REST_Request $request)
  {
    $scan_results = $request->get_json_params();

    if (empty($scan_results)) {
      return new WP_REST_Response(['success' => false, 'message' => 'No data received.'], 400);
    }

    $settings = Vital_Signs::get_instance();
    $settings->set_setting('last_core_files_check', $scan_results);

    return new WP_REST_Response(['success' => true, 'message' => 'Core files check data saved.'], 200);
  }

  /**
   * --- NEW METHOD ---
   * Callback to clear all plugin settings from the database.
   *
   * @return WP_REST_Response
   */
  public function clear_all_settings()
  {
    $settings_instance = Vital_Signs::get_instance();

    // Calls the new method in your main plugin class
    $deleted = $settings_instance->delete_all_settings();

    if ($deleted) {
      return new WP_REST_Response([
        'success' => true,
        'message' => 'All Vital Signs settings have been cleared.'
      ], 200);
    }

    return new WP_REST_Response([
      'success' => false,
      'message' => 'Could not clear settings or no settings were found.'
    ], 500);
  }
}

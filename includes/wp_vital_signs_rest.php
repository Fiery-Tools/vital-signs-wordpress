<?php
if (! defined('ABSPATH')) exit;
// http://wp.local/wp-json/vital-signs/v1/status
class WP_Vital_Signs_REST
{
  private static $instance;

  /**
   * Ensures only one instance of the class is loaded.
   * @return WP_Vital_Signs_REST - Main instance
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

  public function register_routes()
  {
    register_rest_route('vital-signs/v1', '/status', [
      'methods'  => 'GET',
      'callback' => [$this, 'get_status'],
      'permission_callback' => function () {
        return current_user_can('manage_options');
      }
    ]);
    register_rest_route('vital-signs/v1', '/vulnerabilities', [
      'methods'  => 'GET',
      'callback' => [$this, 'get_vulnerabilities'],
      'permission_callback' => function () {
        return current_user_can('manage_options');
      }
    ]);
    register_rest_route('vital-signs/v1', '/deactivate', [
      'methods' => 'POST',
      'callback' => [$this, 'deactivate_plugin'],
      'permission_callback' => function () {
        return current_user_can('activate_plugins');
      },
    ]);
    register_rest_route('vital-signs/v1', '/checksums', [
      'methods' => 'GET',
      'callback' => [$this, 'get_checksums'],
      'permission_callback' => function () {
        return current_user_can('activate_plugins');
      },
    ]);
    register_rest_route('vital-signs/v1', '/checksum_chunk', [
      'methods' => 'POST',
      'callback' => [$this, 'checksums_for_chunk'],
      'permission_callback' => function () {
        return current_user_can('activate_plugins');
      },
    ]);
  }

  public function get_status()
  {
    return [
      'php_version' => phpversion(),
      'wp_version'  => get_bloginfo('version'),
      'plugins'   => count(get_plugins()),
      'timestamp'   => current_time('mysql'),
    ];
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

  function deactivate_plugin($slug)
  {

    $_post = $this->getPostData();
    $slug = $_post["slug"];

    if (!is_plugin_active($slug)) {
      return ['message' => 'Plugin is not active'];
    }

    deactivate_plugins($slug);

    return ['message' => 'Plugin deactivated successfully'];
  }

  public function get_checksums()
  {
    global $wp_version;

    $checksums = get_core_checksums($wp_version, 'en_US');
    return $checksums;
  }


  public function checksums_for_chunk()
  {
    global $wp_version;
    $_post = $this->getPostData();
    $chunk = $_post["chunk"];
    $checksums = get_core_checksums($wp_version, 'en_US');
    $retval = [];
    foreach ($chunk as $file) {
      $status = 'failed';

      if (!isset($checksums[$file['name']])) {
        $retval[] = [
          'name' => $file['name'],
          'status' => 'unknown',
        ];
        continue;
      }

      if ($checksums[$file['name']] === md5_file($file['name'])) {
        $status = 'verified';
      } else {
        if (!file_exists($file['name'])) {
          $status = 'missing';
        }
        if (preg_match('/twentytwentythree/', $file['name'])) {
          $status = 'failed';
        } else {
          $status = 'unknown';
        }
      }

      $retval[] = [
        'name' => $file['name'],
        'status' => $status,
      ];
    }

    return $retval;
  }

  public function get_vulnerabilities()
  {
    $vulnerabilities_found = [
      'plugins' => [],
      'themes' => [],
    ];

    // Get cached vulnerability data
    $vulnerability_data = get_transient('wordfence_vulnerability_data');

    // If no cache, fetch from Wordfence API
    if (false === $vulnerability_data) {
      $response = wp_remote_get('https://www.wordfence.com/api/intelligence/v2/vulnerabilities/production');

      if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
        return ['error' => 'Could not retrieve vulnerability data from Wordfence.'];
      }

      $vulnerability_data = json_decode(wp_remote_retrieve_body($response), true);

      if (! $vulnerability_data) {
        return ['error' => 'Could not parse vulnerability data.'];
      }

      // Cache the data for 12 hours
      set_transient('wordfence_vulnerability_data', $vulnerability_data, 12 * HOUR_IN_SECONDS);
    }

    // Get installed plugins
    if (! function_exists('get_plugins')) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $installed_plugins = get_plugins();
    $active_plugins = get_option('active_plugins');


    // Get active theme
    $active_theme = wp_get_theme();

    // Check plugins for vulnerabilities
    foreach ($installed_plugins as $plugin_path => $plugin_data) {
      if (! in_array($plugin_path, $active_plugins, true)) {
        continue; // Skip inactive plugins
      }
      $plugin_slug = dirname($plugin_path);
      if ('.' === $plugin_slug) {
        $plugin_slug = preg_replace('/\..+$/', '', $plugin_path);
      }

      foreach ($vulnerability_data as $vuln_id => $vuln_details) {
        if (isset($vuln_details['software']) && is_array($vuln_details['software'])) {
          foreach ($vuln_details['software'] as $software) {
            if ($software['type'] === 'plugin' && $software['slug'] === $plugin_slug) {
              if (isset($software['affected_versions']) && is_array($software['affected_versions'])) {
                foreach ($software['affected_versions'] as $version_range => $version_data) {
                  if (version_compare($plugin_data['Version'], $version_data['from_version'], '>=') && version_compare($plugin_data['Version'], $version_data['to_version'], '<=')) {
                    $vulnerabilities_found['plugins'][$plugin_data['Name']][] = [
                      'vulnerability' => $vuln_details['title'],
                      'version' => $plugin_data['Version'],
                      'details_link' => $vuln_details["cve_link"] ?? '',
                      'slug' => $plugin_path,
                      'fixed_in' => isset($software['patched_versions']) ? implode(', ', $software['patched_versions']) : 'Not specified',
                    ];
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check active theme for vulnerabilities
    $theme_slug = $active_theme->get_stylesheet();
    foreach ($vulnerability_data as $vuln_id => $vuln_details) {
      if (isset($vuln_details['software']) && is_array($vuln_details['software'])) {
        foreach ($vuln_details['software'] as $software) {
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

    $settings = WP_Vital_Signs::get_instance();
    $settings->set_setting('last_vulnerability_check', $vulnerabilities_found);

    return $vulnerabilities_found;
  }
}

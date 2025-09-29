<?php
if (! defined('ABSPATH')) exit;

class Vital_Signs
{
  private $is_dev;
  private static $instance;
  private $settings;
  const OPTION_NAME = 'wpVITAL_SIGNS_settings';

  /**
   * Ensures only one instance of the class is loaded.
   * @return Vital_Signs - Main instance
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
    $this->is_dev = defined('VITAL_SIGNS_DEV') && constant('VITAL_SIGNS_DEV');
    add_action('admin_menu', [$this, 'add_menu_page']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    $this->settings = get_option(self::OPTION_NAME, array());
  }

  public function enqueue_assets($hook)
  {
    if ($hook !== 'toplevel_page_vital-signs') return;

    $dev_loader_path = VITAL_SIGNS_PLUGIN_DIR . 'dev-loader.php';
    if (file_exists($dev_loader_path)) {

      // If the dev file exists, load it.
      require_once $dev_loader_path;
    } else {


      $manifest_path = VITAL_SIGNS_PLUGIN_DIR . 'build/.vite/manifest.json';
      if (! file_exists($manifest_path)) {
        return;
      }

      $manifest = json_decode(file_get_contents($manifest_path), true);
      $main_entry = $manifest['src/main.jsx'];

      // Main JS
      wp_enqueue_script(
        'vs-admin-js',
        VITAL_SIGNS_PLUGIN_URL . 'build/' . $main_entry['file'],
        [],
        null,
        true
      );

      // Main CSS (if exists)
      foreach ($main_entry['css'] as $css_file) {
        wp_enqueue_style(
          'vs-admin-css' . $css_file,
          VITAL_SIGNS_PLUGIN_URL . 'build/' . $css_file
        );
      }

      wp_localize_script('vs-admin-js', 'VITAL_SIGNS_DATA', [
        'rest_url' => rest_url('vital-signs/v1'),
        'nonce'  => wp_create_nonce('wp_rest')
      ]);
    }
  }

  public function add_menu_page()
  {
    add_menu_page(
      'vital-signs',
      'Vital Signs',
      'manage_options',
      'vital-signs',
      [$this, 'render_admin_page'],
      'dashicons-heart',
      80
    );
  }

  public function render_admin_page()
  {
    ?>
    <div class="wrap">

      <div id="vs-admin-root"></div>
    </div>
<?php
  }

  /**
   * Get a specific setting.
   *
   * @param string $key The key of the setting to retrieve. Use dot notation for nested values (e.g., 'parent.child').
   * @param mixed  $default The default value to return if the key is not found.
   * @return mixed The value of the setting or the default value.
   */
  public function get_setting($key, $default = null)
  {
    // Start with all settings
    $value = $this->settings;
    // Split the key by dots for nested access
    $keys = explode('.', $key);

    // Traverse the settings array
    foreach ($keys as $inner_key) {
      if (! is_array($value) || ! isset($value[$inner_key])) {
        return $default; // Return default if key doesn't exist at any level
      }
      $value = $value[$inner_key];
    }

    return $value;
  }

  /**
   * Set a specific setting and save it to the database.
   *
   * @param string $key   The key of the setting to set. Use dot notation for nested values (e.g., 'parent.child').
   * @param mixed  $value The value to set for the key.
   * @return bool         True if the setting was updated, false otherwise.
   */
  public function set_setting($key, $value)
  {
    // A reference is used to directly modify the class's settings array.
    $settings_ref = &$this->settings;

    // Split the key by dots to traverse the array.
    $keys = explode('.', $key);

    // Traverse the array, creating nested arrays if they don't exist.
    // We go up to the second-to-last key.
    while (count($keys) > 1) {
      $inner_key = array_shift($keys);

      // If the key doesn't exist or isn't an array, create it.
      if (!isset($settings_ref[$inner_key]) || !is_array($settings_ref[$inner_key])) {
        $settings_ref[$inner_key] = [];
      }

      // Move the reference deeper into the array.
      $settings_ref = &$settings_ref[$inner_key];
    }

    // Set the final value on the last key.
    $settings_ref[array_shift($keys)] = $value;

    // Save the entire updated settings array to the database.
    // update_option returns true if the value was changed, false otherwise.
    return update_option(self::OPTION_NAME, $this->settings);
  }

  /**
   * On plugin activation, set up the default settings.
   * This method is static and called by the hook in the main plugin file.
   */
  public static function activate()
  {
    // Define your default JSON settings structure
    $default_settings = array(
      'last_core_files_result' => array(
        'success' => false,
        'issuesFound' => 0,
        'last_checked' => null
      ),
      'last_vulnerability_check' => array(
        'success' => false,
        'plugins_vulnerable' => 0
      ),
      'api_key' => '',
      'general' => array(
        'check_interval' => 'daily'
      )
    );

    // Add the option to the database. The 'add_option' function
    // will not update the value if the option already exists.
    add_option('wpVITAL_SIGNS_settings', $default_settings, '', 'yes');
  }

  public function delete_all_settings()
  {
    // Clear the settings property in the current instance to reflect the change immediately.
    $this->settings = array();

    // Delete the option from the WordPress database.
    return delete_option(self::OPTION_NAME);
  }
}

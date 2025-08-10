<?php
if (! defined('ABSPATH')) exit;

class VS_Admin
{
  private $is_dev;

  public function __construct()
  {
    $this->is_dev = defined('VS_DEV') && constant('VS_DEV');
    add_action('admin_menu', [$this, 'add_menu_page']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
  }

  public function enqueue_assets($hook)
  {
    if ($hook !== 'toplevel_page_wp-vital-signs') return;

    if ($this->is_dev) {
      add_action('admin_head', function () {
        $nonce = wp_create_nonce('wp_rest');
?>
        <script type="module">
          import RefreshRuntime from 'http://localhost:5173/@react-refresh'
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
          window.VS_DATA = {
            rest_url: "/wp-json/vital-signs/v1/status",
            nonce: "<?php echo $nonce ?>",
            dev: true
          }
        </script>
        <script type="module" src="http://localhost:5173/src/main.jsx"></script>
    <?php
      });
    } else {


      $manifest_path = VS_PLUGIN_DIR . 'build/.vite/manifest.json';
      if (! file_exists($manifest_path)) {
        return;
      }

      $manifest = json_decode(file_get_contents($manifest_path), true);
      $main_entry = $manifest['src/main.jsx'];

      // Main JS
      wp_enqueue_script(
        'vs-admin-js',
        VS_PLUGIN_URL . 'build/' . $main_entry['file'],
        [],
        null,
        true
      );

      // Main CSS (if exists)
      foreach ($main_entry['css'] as $css_file) {
        wp_enqueue_style(
          'vs-admin-css' . $css_file,
          VS_PLUGIN_URL . 'build/' . $css_file
        );
      }

      wp_localize_script('vs-admin-js', 'VS_DATA', [
        'rest_url' => rest_url('vital-signs/v1/status'),
        'nonce'  => wp_create_nonce('wp_rest')
      ]);
    }
  }

  public function add_menu_page()
  {
    add_menu_page(
      'WP Vital Signs',
      'Vital Signs',
      'manage_options',
      'wp-vital-signs',
      [$this, 'render_admin_page'],
      'dashicons-heart',
      80
    );
  }

  public function render_admin_page()
  {
    ?>
    <div class="wrap">
      <!-- <h1>WP Vital Signs</h1> -->
      <div id="vs-admin-root"></div>
    </div>
    <?php
  }
}

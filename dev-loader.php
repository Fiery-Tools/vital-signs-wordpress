<?php
// This file is for development only and should not be included in the production build.

if (! defined('ABSPATH')) exit;

// The code that was previously inside the if ($this->is_dev) block
add_action('admin_head', function () {
    $nonce = wp_create_nonce('wp_rest');
?>
    <script type="module">
      import RefreshRuntime from 'http://localhost:5173/@react-refresh'
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      window.VITAL_SIGNS_DATA = {
        rest_url: "/wp-json/vital-signs/v1",
        nonce: "<?php echo $nonce ?>",
        dev: true
      }
    </script>
    <script type="module" src="http://localhost:5173/src/main.jsx"></script>
<?php
});
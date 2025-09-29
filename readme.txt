=== Vital Signs ===
Contributors: fierytools
Tags: security, core files, vulnerabilities, site health, admin
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A powerful security and health monitoring tool. Scan core files, check for plugin vulnerabilities, and view a detailed system status report.

== Description ==

Vital Signs provides a suite of powerful security tools Including Vulnerabilities scan and Core-files checksum scanner.

**Core Features:**

*   **Core File Scanner:** Compares your WordPress core files against the official checksums from WordPress.org to detect unauthorized changes, additions, or deletions.
*   **Vulnerability Scanner:** Checks your installed plugins and themes against a comprehensive vulnerability database, alerting you to known security risks and providing information on patched versions.
*   **System Status Report:** A detailed and easy-to-read overview of your WordPress and server environment, perfect for debugging or providing information to support.
*   **Modern, Fast Interface:** Built with React, the interface is designed to be fast, intuitive, and a pleasure to use.

Whether you're a developer managing client sites or a site owner who values security, Vital Signs provides the clarity you need to maintain a healthy and secure website.

== Installation ==

1.  Upload the `vital-signs` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Find the "Vital Signs" menu item in your WordPress admin dashboard to access the scanner and reports.

== Frequently Asked Questions ==

= Does this plugin slow down my site? =

No. Vital Signs is designed with performance in mind. All scans are initiated manually by you and run as client-side processes that communicate with your server in small, efficient chunks. It does not run any persistent background processes that would slow down your site's frontend.

= Where does the vulnerability data come from? =

Vulnerability intelligence is sourced from the industry-leading Wordfence Intelligence public database, which is continuously updated.

= Is the plugin free? =

Yes, this version of the plugin is completely free to use.

== Screenshots ==

1.  The main dashboard showing an overview of all security checks.
2.  The Core File Scanner in action, showing progress and results.
3.  The detailed list of issues found by the Core File Scanner.
4.  The Vulnerability Scanner results for plugins and themes.
5.  The comprehensive System Status report.

== Changelog ==

= 1.0.0 =
*   Initial public release.

== Source Code ==

This plugin, like many modern WordPress tools, uses build processes (NPM, Vite) to compile and minify its JavaScript and CSS assets for performance. The original, human-readable source code is publicly available for review, modification, and contribution.

*   **Public Repository:** [https://github.com/Fiery-Tools/vital-signs-wordpress](https://github.com/Fiery-Tools/vital-signs-wordpress)
*   **Build Instructions:** To compile the source code yourself, please ensure you have Node.js and npm installed. Clone the repository, run `npm install` to install dependencies, and then `npm run build` to generate the production files.

== External Services ==

This plugin connects to the following external services to perform its security checks:

*   **Service:** WordPress.org Core Checksums API
    *   **Purpose:** To fetch the official checksums (MD5 hashes) for WordPress core files. This is essential for the "Core Files" scanner to verify file integrity.
    *   **Data Sent:** The current WordPress version and locale (e.g., 6.4.2, en_US) are sent to retrieve the correct checksum list. No personal or site-identifying data is transmitted.
    *   **Terms of Service:** The WordPress.org API is governed by the general WordPress.org terms of service. More information can be found at [https://wordpress.org/about/privacy/](https://wordpress.org/about/privacy/).

*   **Service:** Wordfence Intelligence Vulnerability Database API
    *   **Purpose:** To check installed plugins and themes against a comprehensive, up-to-date database of known vulnerabilities.
    *   **Data Sent:** The slugs and version numbers of your installed plugins and themes are sent to the API. This information is not tied to your specific website or user data.
    *   **Terms of Service:** [https://www.wordfence.com/terms-of-service/](https://www.wordfence.com/terms-of-service/)
    *   **Privacy Policy:** [https://www.wordfence.com/privacy-policy/](https://www.wordfence.com/privacy-policy/)
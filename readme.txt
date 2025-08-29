=== WP Vital Signs ===
Contributors: fierytools
Tags: security, monitoring, health check, core files, vulnerability scanner, site health, admin
Requires at least: 5.8
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A lightweight yet powerful security and monitoring tool to keep your WordPress site healthy. Scan core files, check for vulnerabilities in plugins & themes, and view a detailed system status report.

== Description ==

WP Vital Signs is your essential health monitor for your WordPress website. In an ecosystem with thousands of plugins and themes, keeping track of your site's integrity is critical. This plugin provides a suite of powerful tools in a clean, modern interface to help you identify potential issues before they become serious problems.

**Core Features:**

*   **Core File Scanner:** Compares your WordPress core files against the official checksums from WordPress.org to detect unauthorized changes, additions, or deletions.
*   **Vulnerability Scanner:** Checks your installed plugins and themes against a comprehensive vulnerability database, alerting you to known security risks and providing information on patched versions.
*   **System Status Report:** A detailed and easy-to-read overview of your WordPress and server environment, perfect for debugging or providing information to support.
*   **Modern, Fast Interface:** Built with React, the interface is designed to be fast, intuitive, and a pleasure to use.

Whether you're a developer managing client sites or a site owner who values security, WP Vital Signs provides the clarity you need to maintain a healthy and secure website.

== Installation ==

1.  Upload the `wp-vital-signs` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Find the "Vital Signs" menu item in your WordPress admin dashboard to access the scanner and reports.

== Frequently Asked Questions ==

= Does this plugin slow down my site? =

No. WP Vital Signs is designed with performance in mind. All scans are initiated manually by you and run as client-side processes that communicate with your server in small, efficient chunks. It does not run any persistent background processes that would slow down your site's frontend.

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
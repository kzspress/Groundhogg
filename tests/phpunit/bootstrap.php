<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Groundhogg
 */

use Groundhogg\Plugin;

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( dirname( __DIR__ ) ) . '/groundhogg.php';
}

/**
 * manually install any DBs
 */
function _manually_install_groundhogg() {
	Plugin::instance()->installer->activation_hook( false );
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );
tests_add_filter( 'init', '_manually_install_groundhogg' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';

/**
 * Load framework additions
 */
function _load_framework_additions() {
	require __DIR__ . '/framework/class-gh-unittest-factory-for-thing.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-contact.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-funnel.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-step.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-event.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-event-queue.php';
	require __DIR__ . '/framework/class-gh-unittest-factory-for-activity.php';
	require __DIR__ . '/framework/class-gh-unittest-factory.php';
	require __DIR__ . '/framework/class-gh-unittest-id-generator.php';
	require __DIR__ . '/framework/class-gh-unittest-time-generator.php';
	require __DIR__ . '/framework/class-gh-unittestcase.php';
}

_load_framework_additions();

define( 'DOING_GROUNDHOGG_TESTS', true );

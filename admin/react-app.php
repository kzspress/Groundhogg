<?php

namespace Groundhogg\Admin;

use Groundhogg\Plugin;
use function Groundhogg\get_url_var;
use function Groundhogg\groundhogg_logo;

class React_App {

	public function __construct() {
		add_action( 'admin_init', [ $this, 'maybe_render' ] );

		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_nonces' ] );
		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_ajax_url' ] );
		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_rest_base' ] );
		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_assets' ] );
		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_userdata' ] );
//		add_filter( 'groundhogg/admin/react_init_obj', [ $this, 'register_api_endpoints' ] );
	}

	public function maybe_render() {

		if ( get_url_var( 'page' ) !== 'groundhogg' ) {
			return;
		}

		if ( ! current_user_can( 'view_contacts' ) ) {
			wp_die( __( 'You do not have access to this platform.', 'groundhogg' ) );
		}

		Plugin::instance()->scripts->register_admin_scripts();
		Plugin::instance()->scripts->register_admin_styles();

		$react_init_obj = apply_filters( 'groundhogg/admin/react_init_obj', [] );

		wp_localize_script( 'groundhogg-react', 'groundhogg', $react_init_obj );

		wp_enqueue_style( 'bootstrap', GROUNDHOGG_ASSETS_URL . 'css/bootstrap.min.css' );
		wp_enqueue_style( 'fa-icons', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' );
		wp_enqueue_style( 'groundhogg-admin-react' );

		do_action( 'enqueue_groundhogg_assets_header' );

		ob_start();

		$this->edit_header();
		$this->edit_content();
		$this->edit_footer();
		exit;

	}

	/**
	 * Groundhogg header!
	 */
	protected function edit_header() {
		?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?>>
        <head>
            <meta name="viewport" content="width=device-width"/>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <title><?php esc_html_e( 'Groundhogg', 'groundhogg' ); ?></title>
			<?php do_action( 'admin_print_styles' ); ?>
			<?php do_action( 'groundhogg_head' ); ?>
        </head>
        <body class="groundhogg groundhogg-funnel">
		<?php
	}

	/**
	 * Where react starts
	 */
	protected function edit_content() {
		?>
        <div id="root"></div>
		<?php
	}

	/**
	 * The Groundhogg footer
	 */
	protected function edit_footer() {
		?>
        </body>
		<?php do_action( 'groundhogg_footer' ); ?>
		<?php wp_print_scripts( 'groundhogg-react' ) ?>
        </html>
		<?php
	}

	/**
	 * Register the nonces that will be required for accessing this
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_nonces( $obj ) {

		$obj['nonces'] = [
			'_wpnonce'            => wp_create_nonce(),
			'_wprest'             => wp_create_nonce( 'wp_rest' ),
			'_adminajax'          => wp_create_nonce( 'admin_ajax' ),
			'_ajax_linking_nonce' => wp_create_nonce( 'internal-linking' ),
		];

		return $obj;
	}

	/**
	 * Make the rest API base accessible
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_rest_base( $obj ) {

		$obj['rest_base'] = rest_url( 'gh/v3' );

		return $obj;
	}

	/**
	 * Make the rest API base accessible
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_ajax_url( $obj ) {

		$obj['ajax_url'] = admin_url( 'admin-ajax.php' );

		return $obj;
	}

	/**
	 * Make the rest API base accessible
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_assets( $obj ) {

		$obj['assets'] = [
			'bigG'      => GROUNDHOGG_ASSETS_URL . '/images/big-g.png',
			'logoBlack' => GROUNDHOGG_ASSETS_URL . '/images/logo-black-1000x182.png',
			'logoWhite' => GROUNDHOGG_ASSETS_URL . '/images/logo-white-1000x182.png',
			'welcome'   => [
				'import'    => GROUNDHOGG_ASSETS_URL . 'images/welcome/import-your-contact-list-with-groundhogg.png',
				'funnel'    => GROUNDHOGG_ASSETS_URL . 'images/welcome/create-your-first-funnel-with-groundhogg.png',
				'broadcast' => GROUNDHOGG_ASSETS_URL . 'images/welcome/send-your-first-broadcast-with-groundhogg.png',
				'cron'      => GROUNDHOGG_ASSETS_URL . 'images/welcome/correctly-configure-wp-cron-for-groundhogg.png',
				'course'      => GROUNDHOGG_ASSETS_URL . 'images/welcome/official-quickstart-course-for-groundhogg.png',
			],
		];

		return $obj;
	}

	/**
	 * Make the rest API base accessible
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_api_endpoints( $obj ) {

		$obj['api'] = [
			''
		];

		return $obj;
	}

	/**
	 * Make the rest API base accessible
	 *
	 * @param $obj
	 *
	 * @return mixed
	 */
	public function register_userdata( $obj ) {

		$obj['user'] = wp_get_current_user();

		return $obj;
	}

}

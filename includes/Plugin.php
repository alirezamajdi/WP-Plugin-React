<?php

namespace Contact\SignUp;
use Contact\SignUp\Helpers\Singleton;
use Contact\SignUp\Helpers\Traits;

final class Plugin extends Singleton {
	use Traits;

	public static function init() {
		// on plugin activation and deactivation
		register_activation_hook( CONTACT_SIGNUP_FILE, [ __CLASS__, 'on_activation' ] );
		register_deactivation_hook( CONTACT_SIGNUP_FILE, [ __CLASS__, 'on_deactivation' ] );
		
		add_action( 'plugins_loaded', [ __CLASS__, 'check_update_database' ]);
		
		// enqueue scripts, styles and localize
		$enqueue = Enqueue::get_instance();
		add_action( 'wp_enqueue_scripts', [ $enqueue, 'init' ] );
		add_action( 'admin_enqueue_scripts', [ $enqueue, 'init' ] );

		Settings::init();
		ContactAPI::init();
		ContactBlock::init();
		
	}

	/**
	 * Stuffs to do on plugin activation
	 *
	 * @return void
	 */
	public static function on_activation() {
			global $wpdb;
            $table_name = $wpdb->prefix . 'contact_signup';
            $charset_collate = $wpdb->get_charset_collate();

            $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                name tinytext NOT NULL,
                address text NOT NULL,
                phone varchar(20) NOT NULL,
                email varchar(100) NOT NULL,
                hobbies text NOT NULL,
                PRIMARY KEY (id)
            ) $charset_collate;";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);

			flush_rewrite_rules( true );
	}

	/**
	 * Stuffs to do on plugin deactivation
	 *
	 * @return void
	 */
	public static function on_deactivation() {
		global $wpdb;
        $table_name = $wpdb->prefix . 'contact_signup';

        $sql = "DROP TABLE IF EXISTS $table_name;";
        $wpdb->query($sql);
		flush_rewrite_rules( true );
		
	}

	// Function to check and update the database schema
	public static function check_update_database() {
		$installed_version = get_option('contact_signup_version');

		if ($installed_version !== CONTACT_SIGNUP_VERSION) {
			// Update the database version
			update_option('contact_signup_version', CONTACT_SIGNUP_VERSION);
		}
	}

	
}
<?php
namespace Contact\SignUp;
use Contact\SignUp\Helpers\Singleton;

final class Enqueue extends Singleton {
	public function init() {
		$this->register_scripts();
		$this->register_styles();
		$this->localize();
		$this->load();
	}

	public static function register_scripts(){

		wp_register_script(
			'contactSignup-block-js',
			CONTACT_SIGNUP_URL . 'build/block.js', // Make sure this path is correct
			[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data' ],
			'1.0.0',
			true
		);
		
		wp_register_script(
			'contactSignup-bundle',
			CONTACT_SIGNUP_URL . 'build/index.js',
			[ 'jquery', 'wp-element' ],
			'1.0.0',
			true
		);

		wp_register_script(
			'contact-signup-script', 
			CONTACT_SIGNUP_URL . 'assets/js/script.js', 
			array('jquery'), 
			null, 
			true
		);

	}

	public static function register_styles(){
		wp_register_style(
			'contactSignup-style',
			CONTACT_SIGNUP_URL . 'assets/css/style.css',
			[],
			'1.0.0',
			'all'
		);
		  wp_register_style(
			'contactSignup-editor-style',
			CONTACT_SIGNUP_URL . 'build/editor.css',
			[],
			'1.0.0',
			'all'
		);
	}

	public static function localize(){
		$contact = [
			'token'                  => wp_create_nonce( 'contactSignup-nonce' ),
			'nonce'                  => wp_create_nonce( 'wp_rest' ),
			'admin_ajax'             => admin_url( 'admin-ajax.php' ),
			'home_url'               => home_url(),
			'apiUrl' 				 => home_url( '/wp-json' ),
		];

		wp_localize_script('contactSignup-block-js', 'appLocalizer', $contact);
		wp_localize_script( 'contactSignup-bundle', 'appLocalizer', $contact );

		wp_localize_script('contact-signup-script', 'ContactSignupData', array(
			'apiUrl' => esc_url(rest_url('contact-signup/v1/contact')),
			'nonce' => wp_create_nonce('wp_rest'),
			'predefinedHobbies' => json_encode(self::predefinedHobbies()),
		));
		
	}

	public static function predefinedHobbies() {
		return ['Fishing', 'Running', 'Reading', 'Cooking', 'Traveling', 'Gardening', 'Hiking', 'Photography'];
	}

	public function load(){
		$this->enqueue_media(['contact-signup-script']);
		$this->enqueue_media(['contactSignup-bundle', 'contactSignup-block-js']);
		$this->enqueue_media(['contactSignup-style', 'contactSignup-editor-style'], 'style');
	}

	/**
	 * @param array $handles Array of media handles
	 * @param string $types Media types 'script' or 'style'
	 */
	public function enqueue_media( $handles, $type = 'script' ) {

			if ($type === 'script') {
				foreach ($handles as $h) {
					wp_enqueue_script($h);
				}
				return;
			}

			// enqueue styles
			foreach ($handles as $h) {
				wp_enqueue_style($h);
			}
		
	}
}
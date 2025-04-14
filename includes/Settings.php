<?php 
namespace Contact\SignUp;
class Settings {
    public static function init() {
        add_action( 'admin_menu', [ __CLASS__, 'create_admin_menu' ] );
    }

    public static function create_admin_menu(){
        $capability = 'manage_options';
        $slug = 'contact-signup';

        // Main menu page
        add_menu_page(
            __( 'Statistic', 'contact-signup' ),
            __( 'Statistic', 'contact-signup' ),
            $capability,
            $slug,
            [ __CLASS__, 'menu_page_template' ],
            'dashicons-buddicons-replies'
        );

        // Sub-pages
        add_submenu_page(
            $slug,
            __( 'Overview', 'contact-signup' ),
            __( 'Overview', 'contact-signup' ),
            $capability,
            $slug,
            [ __CLASS__, 'menu_page_template' ]
        );

        add_submenu_page(
            $slug,
            __( 'Visitor Insights', 'contact-signup' ),
            __( 'Visitor Insights', 'contact-signup' ),
            $capability,
            'contact-signup-add',
            [ __CLASS__, 'add_contact_page_template' ]
        );

        add_submenu_page(
            $slug,
            __( 'Page Insights', 'contact-signup' ),
            __( 'Page Insights', 'contact-signup' ),
            $capability,
            'contact-signup-settings',
            [ __CLASS__, 'settings_page_template' ]
        );
    }

    public static function menu_page_template(){
        echo '<div class="wrap"><div id="contactSignup-list-contact"></div></div>';
    }

    public static function add_contact_page_template(){
        echo '<div class="wrap"><div id="contactSignup-add-contact"></div></div>';
    }

    public static function settings_page_template(){
        echo '<div class="wrap"><div id="contactSignup-settings"></div></div>';
    }
}
<?php
namespace Contact\SignUp;
if (!class_exists('ContactAPI')) {
    class ContactAPI {
        public static function init(){
            add_action('rest_api_init', [__CLASS__, 'register_routes']);
        }

        public static function register_routes() {
            register_rest_route('contact-signup/v1', '/contacts', array(
                'methods' => 'GET',
                'callback' => [__CLASS__, 'get_contacts'],
                'permission_callback' => [ __CLASS__, 'get_settings_permission' ]
            ));

            register_rest_route('contact-signup/v1', '/contact', [
                'methods' => 'POST',
                'callback' => [__CLASS__, 'create_contact'],
                'permission_callback' => '__return_true' // Open to all users
            ]);

            register_rest_route('contact-signup/v1', '/contact/(?P<id>\d+)', array(
                'methods' => 'DELETE',
                'callback' => [__CLASS__, 'delete_contact'],
                'permission_callback' => [__CLASS__, 'get_settings_permission']
            ));
        }

        public static function get_settings_permission() {
            return true;
        }

        public static function get_contacts() {
            global $wpdb;
            $table_name = $wpdb->prefix . 'contact_signup';
            $results = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);

            return $results;
        }

        public static function create_contact($request) {
            global $wpdb;
            $table_name = $wpdb->prefix . 'contact_signup';

            $name = sanitize_text_field($request->get_param('name'));
            $address = sanitize_text_field($request->get_param('address'));
            $phone = sanitize_text_field($request->get_param('phone'));
            $email = sanitize_email($request->get_param('email'));
            $hobbies = sanitize_text_field($request->get_param('hobbies'));

            $wpdb->insert($table_name, [
                'name' => $name,
                'address' => $address,
                'phone' => $phone,
                'email' => $email,
                'hobbies' => $hobbies,
            ]);

            return new \WP_REST_Response('Contact created', 201);
        }

        public static function delete_contact($request) {
            global $wpdb;
            $table_name = $wpdb->prefix . 'contact_signup';
            $contact_id = $request['id'];

            // Ensure the contact exists
            $contact = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $contact_id));

            if (!$contact) {
                return new \WP_Error('no_contact', 'Contact not found', array('status' => 404));
            }

            $deleted = $wpdb->delete($table_name, array('id' => $contact_id), array('%d'));

            if ($deleted === false) {
                return new \WP_Error('delete_failed', 'Failed to delete contact', array('status' => 500));
            }

            return new \WP_REST_Response('Contact deleted', 200);
        }
    }

}
?>
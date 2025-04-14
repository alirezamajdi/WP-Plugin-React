<?php 
namespace Contact\SignUp;
class Shortcode {
    public static function init() {
        add_shortcode('contact_signup_form', [__CLASS__, 'render_form']);
        add_action('admin_post_nopriv_contact_signup', [__CLASS__, 'handle_form_submission']);
        add_action('admin_post_contact_signup', [__CLASS__, 'handle_form_submission']);
    }
    public static function render_form() {
        $message = '';
        if (isset($_GET['status']) && $_GET['status'] === 'success') {
            $message = '<p class="success">Thank you for signing up!</p>';
        }elseif (isset($_GET['status']) && $_GET['status'] === 'email_exists') {
            $message = '<p class="error">This email is already registered. Please use a different email.</p>';
        }
        ob_start();
        ?>
<?php echo $message; ?>
<form id="contact-signup-form" method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
    <input type="hidden" name="action" value="contact_signup">
    <?php wp_nonce_field('contact_signup_form', 'contact_signup_nonce'); ?>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="address">Address:</label>
    <input type="text" id="address" name="address" required>
    <label for="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone" required title="Please enter a valid 10-digit phone number">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    <label for="hobbies">Hobbies:</label>
    <input type="text" id="hobbies" name="hobbies" required>
    <button type="submit">Sign Up</button>
</form>

<script>
document.getElementById('contact-signup-form').addEventListener('submit', function(event) {
    var form = event.target;
    var isValid = form.checkValidity();
    if (!isValid) {
        event.preventDefault();
        alert('Please fill out the form correctly.');
    }
});
</script>
<?php
        return ob_get_clean();
    }

    public static function handle_form_submission() {
        if (!isset($_POST['contact_signup_nonce']) || !wp_verify_nonce($_POST['contact_signup_nonce'], 'contact_signup_form')) {
            wp_die('Invalid nonce.');
        }

        $name = sanitize_text_field($_POST['name']);
        $address = sanitize_text_field($_POST['address']);
        $phone = sanitize_text_field($_POST['phone']);
        $email = sanitize_email($_POST['email']);
        $hobbies = sanitize_text_field($_POST['hobbies']);

        if (empty($name) || empty($address) || empty($phone) || empty($email) || empty($hobbies)) {
            wp_die('All fields are required.');
        }

        if (!is_email($email)) {
            wp_die('Invalid email address.');
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'contact_signup';

        // Check if the email already exists
        $existing_email = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE email = %s", $email));
        if ($existing_email > 0) {
            wp_redirect(add_query_arg('status', 'email_exists', wp_get_referer()));
            exit;
        }

        $wpdb->insert($table_name, [
            'name' => $name,
            'address' => $address,
            'phone' => $phone,
            'email' => $email,
            'hobbies' => $hobbies,
        ]);

        wp_redirect(add_query_arg('status', 'success', wp_get_referer()));
        exit;
    }
}
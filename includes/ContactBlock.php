<?php
namespace Contact\SignUp;

if (!class_exists('ContactBlock')) {
  class ContactBlock {
    public static function init() {
      add_action('init', [self::class, 'register_block']);
    }

    public static function register_block() {
      wp_register_script(
        'contact-signup-block-editor',
        plugins_url('../build/block.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data'],
        filemtime(plugin_dir_path(__FILE__) . '../build/block.js'),
        true
      );

      wp_register_style(
        'contact-signup-block-editor-style',
        plugins_url('../build/editor.css', __FILE__),
        ['wp-edit-blocks'],
        filemtime(plugin_dir_path(__FILE__) . '../build/editor.css')
      );

      wp_register_style(
        'contact-signup-block-frontend-style',
        plugins_url('../assets/css/frontend-style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . '../assets/css/frontend-style.css')
      );

      register_block_type('contact-signup/block', [
        'editor_script' => 'contact-signup-block-editor',
        'editor_style'  => 'contact-signup-block-editor-style',
        'style'         => 'contact-signup-block-frontend-style',
        'render_callback' => [self::class, 'render_block'],
        'attributes' => [
          'selectedContact' => [
            'type' => 'number',
            'default' => 0,
          ],
        ],
      ]);

      register_block_type('contact-signup/form', array(
        'render_callback' => [self::class,'contact_signup_form_render_callback']
      ));
    }

    // Render callback for the form
public static function contact_signup_form_render_callback($attributes) {
  ob_start();
  ?>
<form id="contact-signup-form" method="POST"
    data-api-url="<?php echo esc_url(rest_url('contact-signup/v1/contact')); ?>"
    data-nonce="<?php echo wp_create_nonce('wp_rest'); ?>"
    data-predefined-hobbies='<?php echo json_encode(self::predefinedHobbies()); ?>'>
    <label for="contact_name"><?php _e('Name', 'contact-signup'); ?></label>
    <input type="text" id="contact_name" name="contact_name" required />

    <label for="contact_address"><?php _e('Address', 'contact-signup'); ?></label>
    <input type="text" id="contact_address" name="contact_address" required />

    <label for="contact_phone"><?php _e('Phone', 'contact-signup'); ?></label>
    <input type="text" id="contact_phone" name="contact_phone" required />

    <label for="contact_email"><?php _e('Email', 'contact-signup'); ?></label>
    <input type="email" id="contact_email" name="contact_email" required />

    <label for="contact_hobbies"><?php _e('Hobbies (up to 3)', 'contact-signup'); ?></label>
    <div class="tag-list-container">
        <input type="text" id="contact_hobbies" name="contact_hobbies"
            placeholder="<?php _e('Add hobbies, e.g. fishing, running', 'contact-signup'); ?>" />
        <div class="tag-list"></div>
    </div>

    <button type="submit" id="contact-signup-submit"><?php _e('Sign Up', 'contact-signup'); ?></button>
</form>
<?php
    return ob_get_clean();
}

public static function predefinedHobbies() {
  return ['Fishing', 'Running', 'Reading', 'Cooking', 'Traveling', 'Gardening', 'Hiking', 'Photography'];
}

    public static function render_block($attributes) {
      if (!isset($attributes['selectedContact']) || $attributes['selectedContact'] === 0) {
        return '<p>No contact selected.</p>';
      }

      global $wpdb;
      $table_name = $wpdb->prefix . 'contact_signup';
      $contact_id = (int) $attributes['selectedContact'];
      $contact = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $contact_id));

      if (!$contact) {
        return '<p>Contact not found.</p>';
      }

      ob_start();
      echo '<div class="contact-card">';
      echo '<h2>' . esc_html($contact->name) . '</h2>';
      echo '<p>' . esc_html($contact->address) . '</p>';
      echo '<p>' . esc_html($contact->phone) . '</p>';
      echo '<p>' . esc_html($contact->email) . '</p>';
      echo '<p>' . esc_html($contact->hobbies) . '</p>';
      echo '</div>';
      return ob_get_clean();
    }

  }
}
<?php
function enqueue_tailwind_styles()
{
    wp_enqueue_style('tailwind-css', get_template_directory_uri() . '/tailwind_output.css', [], '1.0.0', 'all');
    wp_enqueue_script('react', get_template_directory_uri() . '/index.js', [], '1.0.0');

}
add_action('wp_enqueue_scripts', 'enqueue_tailwind_styles');


function your_theme_enqueue_scripts()
{
    wp_enqueue_script('react-app', get_template_directory_uri() . '/assets/js/bundle.js', [], '1.0', true);

    wp_localize_script('react-app', 'wpApiSettings', array(
        'root' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ));
}
add_action('wp_enqueue_scripts', 'your_theme_enqueue_scripts');


require_once get_template_directory() . '/shop/shopzi.php';
add_action('rest_api_init', function () {
    // Allow CORS from your front-end URL
    header("Access-Control-Allow-Origin: http://localhost/test/");
    header("Access-Control-Allow-Credentials: true");
});
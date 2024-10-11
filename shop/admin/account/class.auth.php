<?php
class Custom_Login_API
{

    // Constructor to hook into REST API initialization
    public function __construct()
    {
        add_action('rest_api_init', array($this, 'register_login_route'));
    }

    // Register the custom login route
    public function register_login_route()
    {
        register_rest_route('shopzi/v1', '/login', array(
            'methods' => 'POST',
            'callback' => array($this, 'login_user'),
            'permission_callback' => '__return_true' // No permission required since this is login
        ));
    }

    // Handle the login functionality
    public function login_user($request)
    {
        // Get parameters from the request
        $username = sanitize_text_field($request['username']);
        $password = sanitize_text_field($request['password']);

        // Check if username and password were provided
        if (empty($username) || empty($password)) {
            return new WP_Error('empty_credentials', 'Username and password are required.', array('status' => 400));
        }

        // Authenticate user using wp_signon
        $creds = array(
            'user_login' => $username,
            'user_password' => $password,
            'remember' => true, // Remember me for session
        );

        $user = wp_signon($creds, false);

        // Check if authentication failed
        if (is_wp_error($user)) {
            return new WP_Error('invalid_login', 'Invalid username or password.', array('status' => 403));
        }

        // If successful, return user information (optionally include a JWT or session token)
        $user_data = array(
            'user_id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'message' => 'Login successful',
        );

        return rest_ensure_response($user_data);
    }
}

// Initialize the custom login API
$custom_login_api = new Custom_Login_API();

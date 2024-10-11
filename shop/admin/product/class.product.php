<?php
class Product_API
{

    private $table_name;

    // Constructor to initialize the table name and hook actions
    public function __construct()
    {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'shopzi_products'; // Define table name

        // Hook into WordPress
        add_action('after_setup_theme', array($this, 'create_product_table'));
        add_action('rest_api_init', array($this, 'register_product_routes'));
    }

    // Create the custom table for products
    public function create_product_table()
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $this->table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            slug varchar(255) NOT NULL,
            image varchar(255) NOT NULL,
            price float NOT NULL,
            discount_price float DEFAULT NULL,
            categories text NOT NULL,
            tags text NOT NULL,
            rating float NOT NULL,
            SKU varchar(50) NOT NULL,
            description text NOT NULL,
            stock varchar(50) NOT NULL,
            date varchar(20) NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";


        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    // Register custom REST API routes
    public function register_product_routes()
    {
        register_rest_route('shopzi/v1', '/product/', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_products'),
        ));

        register_rest_route('shopzi/v1', '/product/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product'),
        ));

        register_rest_route('shopzi/v1', '/product/', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_product'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            }
        ));



        // Routes for CRUD operations on individual entities


        register_rest_route('shopzi/v1', '/product/(?P<id>\d+)', array(
            'methods' => 'PUT',
            'callback' => array($this, 'update_product'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            }
        ));

        register_rest_route('shopzi/v1', '/product/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_product'),
            'permission_callback' => function () {
                return current_user_can('delete_posts');
            }
        ));
    }

    // Get all products (READ)
    public function get_products()
    {
        global $wpdb;
        $products = $wpdb->get_results("SELECT * FROM $this->table_name");

        return rest_ensure_response($products);
    }

    // Get a single product by ID (READ)
    public function get_product($data)
    {
        global $wpdb;
        $product = $wpdb->get_row($wpdb->prepare("SELECT * FROM $this->table_name WHERE id = %d", $data['id']));

        if (!$product) {
            return new WP_Error('no_product', 'Product not found', array('status' => 404));
        }

        return rest_ensure_response($product);
    }

    // Create a new product (CREATE)
    public function create_product($request)
    {
        if (!is_user_logged_in()) {
            return new WP_Error('rest_not_logged_in', 'You are not logged in.', array('status' => 401));
        }

        $current_user = wp_get_current_user();
        if (!current_user_can('edit_posts')) {
            return new WP_Error('rest_forbidden', 'You do not have permission to create products.', array('status' => 403));
        }

        global $wpdb;

        // Define allowed tags for sanitizing HTML content
        $allowed_tags = array(
            'p' => array(),
            'a' => array(
                'href' => true,
                'title' => true,
            ),
        );

        // Handle thumbnail image upload
        $image_id = null;
        if (!empty($_FILES['thumbnail'])) {
            $image_id = media_handle_upload('thumbnail', 0); // 0 means no specific post attachment
            if (is_wp_error($image_id)) {
                return new WP_Error('thumbnail_upload_failed', 'Image upload failed.', array('status' => 500));
            }
        }

        // Prepare and sanitize data for product
        $data = array(
            'title' => sanitize_text_field($request['title']),
            'slug' => sanitize_text_field($request['slug']),
            'image' => $image_id, // Save the media ID of the uploaded image
            'price' => !empty($request['price']) ? floatval($request['price']) : 0.0,
            'discount_price' => !empty($request['discount_price']) ? floatval($request['discount_price']) : null,
            'description' => wp_kses($request['description'], $allowed_tags),
            'categories' => !empty($request['categories']) ? wp_json_encode($request['categories']) : '[]',
            'tags' => !empty($request['tags']) ? wp_json_encode($request['tags']) : '[]',
            'rating' => !empty($request['rating']) ? floatval($request['rating']) : 0.0,
            'SKU' => sanitize_text_field($request['SKU']),
            'stock' => sanitize_text_field($request['stock']),
            'date' => sanitize_text_field($request['date']),
        );

        // Insert into custom database table
        $wpdb->insert($this->table_name, $data);
        $product_id = $wpdb->insert_id;

        if (!$product_id) {
            return new WP_Error('product_insert_failed', 'Failed to insert product into the database.', array('status' => 500));
        }

        return rest_ensure_response(array('id' => $product_id));
    }


    /**
     * Upload an image to the WordPress media library
     * 
     * @param string $image_url The URL of the image to download and save
     * @return int|WP_Error The attachment ID on success, or WP_Error on failure
     */
    private function upload_image_to_media($image_url)
    {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        // Download image to temp file
        $temp_file = download_url($image_url);
        if (is_wp_error($temp_file)) {
            return $temp_file; // Return error if download fails
        }

        // Prepare an array of file info for the upload
        $file = array(
            'name' => basename($image_url),
            'tmp_name' => $temp_file,
        );

        // Upload image and get attachment ID
        $attachment_id = media_handle_sideload($file, 0); // 0 means unattached
        if (is_wp_error($attachment_id)) {
            @unlink($temp_file); // Clean up the temp file
            return $attachment_id;
        }

        return $attachment_id;
    }



    // Update a product by ID (UPDATE)
    public function update_product($request)
    {
        global $wpdb;

        $data = array(
            'title' => sanitize_text_field($request['title']),
            'slug' => sanitize_text_field($request['slug']),
            'image' => esc_url($request['image']),
            'price' => floatval($request['price']),
            'discount_price' => !empty($request['discount_price']) ? floatval($request['discount_price']) : NULL,
            'categories' => wp_json_encode($request['categories']),
            'tags' => wp_json_encode($request['tags']),
            'rating' => floatval($request['rating']),
            'SKU' => sanitize_text_field($request['SKU']),
            'stock' => sanitize_text_field($request['stock']),
            'date' => sanitize_text_field($request['date']),
        );

        // Update the product by ID
        $where = array('id' => $request['id']);
        $updated = $wpdb->update($this->table_name, $data, $where);

        if ($updated === false) {
            return new WP_Error('update_failed', 'Failed to update product', array('status' => 500));
        }

        return rest_ensure_response(array('message' => 'Product updated', 'id' => $request['id']));
    }

    // Delete a product by ID (DELETE)
    public function delete_product($data)
    {
        global $wpdb;

        // Delete the product by ID
        $deleted = $wpdb->delete($this->table_name, array('id' => $data['id']));

        if ($deleted) {
            return rest_ensure_response(array(
                'message' => 'Product deleted',
                'id' => $data['id
            ']
            ));
        } else {
            return new WP_Error('delete_failed', 'Failed to delete product', array('status' => 500));
        }
    }
}

// Initialize the class
$Product_API = new Product_API();
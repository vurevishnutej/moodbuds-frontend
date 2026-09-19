-- MoodBuds Base Schema - H2 Compatible
-- This is the base schema for MoodBuds application
-- All tables are created in dependency order

-- ============================================================
-- INDEPENDENT TABLES (No Foreign Keys)
-- ============================================================

CREATE TABLE admin_roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_roles_name (name)
);

CREATE TABLE admin_permissions (
  id INT NOT NULL AUTO_INCREMENT,
  permission_key VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_permissions_key (permission_key)
);

CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(140),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_active (is_active)
);

CREATE TABLE gst_rates (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  rate_percentage DECIMAL(5,2) NOT NULL,
  hsn_code VARCHAR(20) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE moods (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  tagline VARCHAR(300),
  personality_tagline VARCHAR(300),
  banner_image_url VARCHAR(500),
  color VARCHAR(40),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_moods_slug (slug),
  KEY idx_moods_active (is_active)
);

CREATE TABLE quiz_paths (
  id INT NOT NULL AUTO_INCREMENT,
  path_key CHAR(1) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  PRIMARY KEY (id),
  UNIQUE KEY uq_quiz_paths_key (path_key)
);

-- ============================================================
-- ADMIN HIERARCHY
-- ============================================================

CREATE TABLE admin_users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100),
  role_id INT NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  mobile VARCHAR(15),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  require_2fa TINYINT(1) NOT NULL DEFAULT 0,
  last_login_at DATETIME,
  failed_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email),
  UNIQUE KEY uq_admin_users_username (username),
  KEY fk_admin_users_role (role_id),
  CONSTRAINT fk_admin_users_role FOREIGN KEY (role_id) REFERENCES admin_roles (id)
);

CREATE TABLE admin_role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  KEY fk_arp_permission (permission_id),
  CONSTRAINT fk_arp_permission FOREIGN KEY (permission_id) REFERENCES admin_permissions (id) ON DELETE CASCADE,
  CONSTRAINT fk_arp_role FOREIGN KEY (role_id) REFERENCES admin_roles (id) ON DELETE CASCADE
);

CREATE TABLE admin_activity_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  admin_user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  old_value JSON,
  new_value JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_aal_admin_user (admin_user_id),
  KEY idx_aal_entity (entity_type, entity_id),
  KEY idx_aal_created_at (created_at),
  CONSTRAINT fk_aal_admin_user FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
);

-- ============================================================
-- CUSTOMER MANAGEMENT
-- ============================================================

CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  mobile VARCHAR(15),
  mobile_verified TINYINT(1) NOT NULL DEFAULT 0,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL DEFAULT '',
  date_of_birth DATE,
  gender ENUM('M', 'F', 'OTHER', 'UNSPECIFIED') NOT NULL DEFAULT 'UNSPECIFIED',
  referral_code VARCHAR(20),
  referred_by BIGINT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  failed_login_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME,
  last_login_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_referral_code (referral_code),
  UNIQUE KEY uq_users_mobile (mobile),
  KEY idx_users_mobile_verified (mobile_verified),
  KEY idx_users_is_active (is_active),
  KEY fk_users_referred_by (referred_by),
  CONSTRAINT fk_users_referred_by FOREIGN KEY (referred_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE otp_verifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  identifier VARCHAR(255) NOT NULL,
  identifier_type ENUM('EMAIL', 'MOBILE') NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  purpose ENUM('REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'MOBILE_VERIFY') NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_used TINYINT(1) NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_otp_identifier_purpose (identifier, purpose),
  KEY idx_otp_expires_at (expires_at)
);

CREATE TABLE customer_auth_sessions (
  id CHAR(36) NOT NULL,
  user_id BIGINT NOT NULL,
  refresh_token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_auth_sessions_refresh_hash (refresh_token_hash),
  KEY idx_customer_auth_sessions_user (user_id),
  KEY idx_customer_auth_sessions_expiry (expires_at),
  CONSTRAINT fk_customer_auth_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE user_addresses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  pincode VARCHAR(10) NOT NULL,
  address_type ENUM('HOME', 'WORK', 'OTHER') NOT NULL DEFAULT 'HOME',
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_addresses_user_id (user_id),
  KEY idx_user_addresses_pincode (pincode),
  CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============================================================
-- PRODUCT CATALOG
-- ============================================================

CREATE TABLE subcategories (
  id INT NOT NULL AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(140),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subcategories_slug (slug),
  KEY idx_subcategories_category (category_id),
  CONSTRAINT fk_subcategories_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(300) NOT NULL,
  slug VARCHAR(360),
  category_id INT NOT NULL,
  subcategory_id INT NOT NULL,
  gst_rate_id INT NOT NULL,
  description MEDIUMTEXT,
  fabric_details VARCHAR(500),
  color_name VARCHAR(100),
  price INT UNSIGNED NOT NULL,
  discount_price INT UNSIGNED,
  weight_grams INT UNSIGNED,
  length_cm DECIMAL(6,2),
  width_cm DECIMAL(6,2),
  height_cm DECIMAL(6,2),
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_new_arrival TINYINT(1) NOT NULL DEFAULT 0,
  is_best_seller TINYINT(1) NOT NULL DEFAULT 0,
  return_window_days TINYINT UNSIGNED NOT NULL DEFAULT 7,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_sku (sku),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id),
  KEY idx_products_subcategory (subcategory_id),
  KEY idx_products_is_active (is_active),
  KEY idx_products_is_featured (is_featured),
  KEY idx_products_price (price),
  KEY fk_products_gst_rate (gst_rate_id),
  KEY fk_products_created_by (created_by),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id),
  CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES admin_users (id),
  CONSTRAINT fk_products_gst_rate FOREIGN KEY (gst_rate_id) REFERENCES gst_rates (id),
  CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories (id)
);

CREATE TABLE product_images (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE product_mood_tags (
  product_id BIGINT NOT NULL,
  mood_id INT NOT NULL,
  PRIMARY KEY (product_id, mood_id),
  KEY idx_pmt_mood_id (mood_id),
  CONSTRAINT fk_pmt_mood FOREIGN KEY (mood_id) REFERENCES moods (id) ON DELETE CASCADE,
  CONSTRAINT fk_pmt_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE product_sizes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL') NOT NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 5,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_size (product_id, size),
  KEY idx_ps_product_id (product_id),
  CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE size_charts (
  id INT NOT NULL AUTO_INCREMENT,
  subcategory_id INT,
  product_id BIGINT,
  chart_image_url VARCHAR(500),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_size_charts_subcategory (subcategory_id),
  KEY fk_size_charts_product (product_id),
  CONSTRAINT fk_size_charts_product FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT fk_size_charts_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories (id)
);

CREATE TABLE inventory_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL') NOT NULL,
  change_type ENUM('SALE', 'RETURN', 'RESTOCK', 'MANUAL_ADJUSTMENT', 'RESERVATION', 'RESERVATION_RELEASE') NOT NULL,
  quantity_change INT NOT NULL,
  quantity_before INT UNSIGNED NOT NULL,
  quantity_after INT UNSIGNED NOT NULL,
  reference_type VARCHAR(50),
  created_by INT UNSIGNED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inv_logs_product_size (product_id, size),
  KEY idx_inv_logs_created_at (created_at),
  CONSTRAINT fk_inv_logs_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- ============================================================
-- COUPONS
-- ============================================================

CREATE TABLE coupons (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(500),
  type ENUM('FLAT', 'PERCENTAGE') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value INT UNSIGNED NOT NULL DEFAULT 0,
  max_discount_amount INT UNSIGNED,
  usage_limit_global INT UNSIGNED,
  usage_limit_per_user INT UNSIGNED NOT NULL DEFAULT 1,
  current_usage_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_public TINYINT(1) NOT NULL DEFAULT 1,
  valid_from DATETIME NOT NULL,
  valid_until DATETIME,
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupons_code (code),
  KEY idx_coupons_active_dates (is_active, valid_from, valid_until),
  KEY fk_coupons_created_by (created_by),
  CONSTRAINT fk_coupons_created_by FOREIGN KEY (created_by) REFERENCES admin_users (id)
);

-- ============================================================
-- SHOPPING CART
-- ============================================================

CREATE TABLE carts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT,
  coupon_id BIGINT,
  coupon_discount INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_carts_user (user_id),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  cart_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL') NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price INT UNSIGNED NOT NULL,
  unit_discount_price INT UNSIGNED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_product_size (cart_id, product_id, size),
  KEY idx_cart_items_cart (cart_id),
  KEY fk_cart_items_product (product_id),
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- ============================================================
-- WISHLIST
-- ============================================================

CREATE TABLE wishlists (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlists_user (user_id),
  CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE wishlist_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  wishlist_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'),
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist_product_size (wishlist_id, product_id, size),
  KEY idx_wi_wishlist (wishlist_id),
  KEY fk_wi_product (product_id),
  CONSTRAINT fk_wi_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_wi_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlists (id) ON DELETE CASCADE
);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(30) NOT NULL,
  user_id BIGINT NOT NULL,
  idempotency_key VARCHAR(128),
  idempotency_fingerprint CHAR(64),
  status ENUM('PENDING_PAYMENT', 'PAYMENT_FAILED', 'PROCESSING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_INITIATED', 'RETURN_PICKUP_SCHEDULED', 'RETURN_RECEIVED', 'REFUND_INITIATED', 'PARTIALLY_REFUNDED', 'REFUNDED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  shipping_address_id BIGINT,
  shipping_address_snapshot_full JSON NOT NULL,
  payment_method ENUM('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'COD'),
  coupon_id BIGINT,
  subtotal INT UNSIGNED NOT NULL,
  coupon_discount INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_cost INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_pricing_status ENUM('PENDING', 'FINALIZED') NOT NULL DEFAULT 'FINALIZED',
  shipping_pricing_source VARCHAR(50) NOT NULL DEFAULT 'FREE_SHIPPING_TEMPORARY',
  gst_amount INT UNSIGNED NOT NULL DEFAULT 0,
  total_amount INT UNSIGNED NOT NULL,
  payment_expires_at DATETIME NOT NULL,
  cancellation_reason VARCHAR(255),
  cancelled_at DATETIME,
  reservation_released_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  UNIQUE KEY uq_orders_customer_idempotency (user_id, idempotency_key),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  KEY idx_orders_created_at (created_at),
  KEY fk_orders_coupon (coupon_id),
  KEY fk_orders_address (shipping_address_id),
  KEY idx_orders_payment_expiry (status, payment_expires_at, reservation_released_at),
  CONSTRAINT fk_orders_address FOREIGN KEY (shipping_address_id) REFERENCES user_addresses (id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons (id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  product_snapshot JSON NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL') NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price INT UNSIGNED NOT NULL,
  unit_discount_price INT UNSIGNED,
  gst_rate_percentage DECIMAL(5,2) NOT NULL,
  gst_amount INT UNSIGNED NOT NULL DEFAULT 0,
  line_total INT UNSIGNED NOT NULL,
  return_window_days_snapshot TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE order_status_history (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  notes VARCHAR(500),
  changed_by_id INT UNSIGNED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_osh_order (order_id),
  KEY idx_osh_created (created_at),
  CONSTRAINT fk_osh_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE TABLE coupon_usage (
  id BIGINT NOT NULL AUTO_INCREMENT,
  coupon_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  order_id BIGINT,
  discount_applied INT UNSIGNED NOT NULL,
  used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cu_coupon_user (coupon_id, user_id),
  KEY idx_cu_order (order_id),
  KEY fk_cu_user (user_id),
  CONSTRAINT fk_cu_coupon FOREIGN KEY (coupon_id) REFERENCES coupons (id),
  CONSTRAINT fk_cu_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
  CONSTRAINT fk_cu_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  idempotency_key VARCHAR(128),
  gateway ENUM('RAZORPAY', 'CASHFREE', 'COD', 'MANUAL') NOT NULL,
  gateway_order_id VARCHAR(255),
  gateway_payment_id VARCHAR(255),
  method ENUM('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'COD'),
  status ENUM('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'INITIATED',
  amount INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  gateway_fee INT UNSIGNED NOT NULL DEFAULT 0,
  gateway_response JSON,
  initiated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_order_idempotency (order_id, idempotency_key),
  UNIQUE KEY uq_payments_gateway_order (gateway_order_id),
  UNIQUE KEY uq_payments_gateway_payment (gateway_payment_id),
  KEY idx_payments_order (order_id),
  KEY idx_payments_gateway_payment_id (gateway_payment_id),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- ============================================================
-- REFUNDS
-- ============================================================

CREATE TABLE refunds (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  idempotency_key VARCHAR(128),
  idempotency_fingerprint CHAR(64),
  status ENUM('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'PARTIAL') NOT NULL DEFAULT 'INITIATED',
  amount INT UNSIGNED NOT NULL,
  initiated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refunds_order_idempotency (order_id, idempotency_key),
  KEY idx_refunds_order (order_id),
  KEY idx_refunds_user (user_id),
  KEY idx_refunds_status (status)
);

CREATE TABLE refund_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  refund_id BIGINT NOT NULL,
  return_item_id BIGINT NOT NULL,
  amount INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refund_item (refund_id, return_item_id),
  KEY idx_refund_items_return_item (return_item_id),
  CONSTRAINT fk_refund_items_refund FOREIGN KEY (refund_id) REFERENCES refunds (id) ON DELETE CASCADE,
  CONSTRAINT fk_refund_items_return_item FOREIGN KEY (return_item_id) REFERENCES return_items (id)
);

-- ============================================================
-- GST INVOICES
-- ============================================================

CREATE TABLE gst_invoices (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  invoice_date DATE NOT NULL,
  seller_gstin VARCHAR(20) NOT NULL,
  seller_name VARCHAR(200) NOT NULL,
  seller_address TEXT NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_gstin VARCHAR(20),
  subtotal INT UNSIGNED NOT NULL,
  cgst_amount INT UNSIGNED NOT NULL DEFAULT 0,
  sgst_amount INT UNSIGNED NOT NULL DEFAULT 0,
  igst_amount INT UNSIGNED NOT NULL DEFAULT 0,
  total_tax INT UNSIGNED NOT NULL DEFAULT 0,
  total_amount INT UNSIGNED NOT NULL,
  pdf_url VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_gst_invoices_order (order_id),
  UNIQUE KEY uq_gst_invoices_number (invoice_number),
  KEY idx_gst_invoices_order (order_id),
  KEY idx_gst_invoices_date (invoice_date),
  CONSTRAINT fk_gst_invoices_order FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- ============================================================
-- RETURNS
-- ============================================================

CREATE TABLE return_requests (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  idempotency_key VARCHAR(128),
  idempotency_fingerprint CHAR(64),
  status ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'ITEM_RECEIVED', 'QUALITY_CHECK_PASSED', 'QUALITY_CHECK_FAILED', 'REFUND_INITIATED', 'COMPLETED', 'CLOSED') NOT NULL DEFAULT 'REQUESTED',
  reason ENUM('DEFECTIVE_PRODUCT', 'WRONG_ITEM_RECEIVED', 'SIZE_DOES_NOT_FIT', 'CHANGED_MIND', 'OTHER') NOT NULL,
  reason_description TEXT,
  pickup_address_id BIGINT,
  pickup_address_snapshot_full JSON,
  admin_notes TEXT,
  rejection_reason VARCHAR(500),
  images JSON,
  inventory_restocked_at DATETIME,
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_returns_customer_idempotency (user_id, idempotency_key),
  KEY idx_rr_order (order_id),
  KEY idx_rr_user (user_id),
  KEY idx_rr_status (status),
  CONSTRAINT fk_rr_order FOREIGN KEY (order_id) REFERENCES orders (id),
  CONSTRAINT fk_rr_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE return_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  return_request_id BIGINT NOT NULL,
  order_item_id BIGINT NOT NULL,
  quantity_to_return SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  reason ENUM('DEFECTIVE', 'WRONG_SIZE', 'WRONG_ITEM', 'OTHER') NOT NULL DEFAULT 'OTHER',
  condition_on_receipt ENUM('GOOD', 'DAMAGED', 'MISSING_TAGS', 'USED'),
  PRIMARY KEY (id),
  UNIQUE KEY uq_return_request_item (return_request_id, order_item_id),
  KEY idx_ri_return_request (return_request_id),
  KEY fk_ri_order_item (order_item_id),
  CONSTRAINT fk_ri_order_item FOREIGN KEY (order_item_id) REFERENCES order_items (id),
  CONSTRAINT fk_ri_return_request FOREIGN KEY (return_request_id) REFERENCES return_requests (id) ON DELETE CASCADE
);

-- ============================================================
-- QUIZ
-- ============================================================

CREATE TABLE quiz_questions (
  id INT NOT NULL AUTO_INCREMENT,
  question_text VARCHAR(500) NOT NULL,
  question_order INT UNSIGNED NOT NULL,
  path_key CHAR(1),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_qq_path_order (path_key, question_order),
  CONSTRAINT fk_qq_path FOREIGN KEY (path_key) REFERENCES quiz_paths (path_key) ON DELETE SET NULL
);

CREATE TABLE quiz_options (
  id INT NOT NULL AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_key CHAR(1) NOT NULL,
  option_text VARCHAR(500) NOT NULL,
  routes_to_path CHAR(1),
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_quiz_option (question_id, option_key),
  KEY idx_qo_question (question_id),
  KEY fk_qo_routes_path (routes_to_path),
  CONSTRAINT fk_qo_question FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE,
  CONSTRAINT fk_qo_routes_path FOREIGN KEY (routes_to_path) REFERENCES quiz_paths (path_key) ON DELETE SET NULL
);

CREATE TABLE quiz_option_mood_weights (
  option_id INT NOT NULL,
  mood_id INT NOT NULL,
  score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (option_id, mood_id),
  KEY fk_qomw_mood (mood_id),
  CONSTRAINT fk_qomw_mood FOREIGN KEY (mood_id) REFERENCES moods (id) ON DELETE CASCADE,
  CONSTRAINT fk_qomw_option FOREIGN KEY (option_id) REFERENCES quiz_options (id) ON DELETE CASCADE
);

CREATE TABLE quiz_sessions (
  id CHAR(36) NOT NULL,
  user_id BIGINT,
  session_token VARCHAR(255),
  ip_address VARCHAR(45),
  result_mood_id INT UNSIGNED,
  is_completed TINYINT(1) NOT NULL DEFAULT 0,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  PRIMARY KEY (id),
  KEY idx_qs_user_id (user_id),
  KEY idx_qs_result_mood (result_mood_id),
  KEY idx_quiz_sessions_started_completed (started_at, is_completed),
  CONSTRAINT fk_qs_result_mood FOREIGN KEY (result_mood_id) REFERENCES moods (id) ON DELETE SET NULL,
  CONSTRAINT fk_qs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE quiz_session_answers (
  id BIGINT NOT NULL AUTO_INCREMENT,
  quiz_session_id CHAR(36) NOT NULL,
  question_id INT NOT NULL,
  option_id INT NOT NULL,
  answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_quiz_session_question (quiz_session_id, question_id),
  KEY idx_qsa_session (quiz_session_id),
  KEY fk_qsa_question (question_id),
  KEY fk_qsa_option (option_id),
  CONSTRAINT fk_qsa_option FOREIGN KEY (option_id) REFERENCES quiz_options (id),
  CONSTRAINT fk_qsa_question FOREIGN KEY (question_id) REFERENCES quiz_questions (id),
  CONSTRAINT fk_qsa_session FOREIGN KEY (quiz_session_id) REFERENCES quiz_sessions (id) ON DELETE CASCADE
);

-- ============================================================
-- FLYWAY MIGRATION TRACKING
-- ============================================================

CREATE TABLE flyway_schema_history (
  installed_rank INT NOT NULL,
  version VARCHAR(50),
  description VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL,
  script VARCHAR(1000) NOT NULL,
  checksum INT,
  installed_by VARCHAR(100) NOT NULL,
  installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  execution_time INT NOT NULL,
  success TINYINT(1) NOT NULL,
  PRIMARY KEY (installed_rank),
  KEY flyway_schema_history_s_idx (success)
);

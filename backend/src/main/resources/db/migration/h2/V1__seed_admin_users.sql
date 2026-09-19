-- Admin User Seed Data for H2 Testing Profile
-- This migration creates test admin users with SUPER_ADMIN role

-- Ensure admin role exists
INSERT IGNORE INTO admin_roles (id, name, description, is_active, created_at) 
VALUES (1, 'SUPER_ADMIN', 'Full system access', 1, CURRENT_TIMESTAMP());

-- Ensure all permissions exist
INSERT IGNORE INTO admin_permissions (id, permission_key, module, description) VALUES
(1, 'catalog.read', 'CATALOG', 'Read catalog data'),
(2, 'catalog.manage', 'CATALOG', 'Create, update, delete categories and subcategories'),
(3, 'products.read', 'PRODUCTS', 'Read product information'),
(4, 'products.manage', 'PRODUCTS', 'Create, update, delete products'),
(5, 'inventory.read', 'INVENTORY', 'View inventory and stock levels'),
(6, 'inventory.manage', 'INVENTORY', 'Manage inventory and stock adjustments'),
(7, 'orders.read', 'ORDERS', 'View order information'),
(8, 'orders.manage', 'ORDERS', 'Manage orders and order status'),
(9, 'payments.read', 'PAYMENTS', 'View payment information'),
(10, 'payments.manage', 'PAYMENTS', 'Manage payment transactions'),
(11, 'refunds.read', 'REFUNDS', 'View refund information'),
(12, 'refunds.manage', 'REFUNDS', 'Manage refunds and returns'),
(13, 'coupons.read', 'COUPONS', 'View coupons'),
(14, 'coupons.manage', 'COUPONS', 'Create and manage coupons'),
(15, 'quiz.read', 'QUIZ', 'View quiz data'),
(16, 'quiz.manage', 'QUIZ', 'Manage quiz questions and options'),
(17, 'admin.users', 'ADMIN', 'Manage admin users'),
(18, 'admin.roles', 'ADMIN', 'Manage roles and permissions'),
(19, 'reports.access', 'REPORTS', 'Access reports and analytics');

-- Assign all permissions to SUPER_ADMIN role (skip duplicates)
INSERT IGNORE INTO admin_role_permissions (role_id, permission_id) 
SELECT 1, id FROM admin_permissions;

-- Delete existing test users if any
DELETE FROM admin_users WHERE username IN ('testadmin', 'owner', 'admin');

-- Insert test admin users
-- Username: testadmin / owner / admin
-- Password: password123
-- BCrypt Hash (strength 12): $2a$12$DcOIIQe5p8xUKzfy41pdIOiAp34ma7NDmj/jJXVVYDpEwfaI676oq
INSERT INTO admin_users (username, password_hash, email, full_name, role_id, is_active, failed_attempts, created_at, updated_at) 
VALUES 
('testadmin', '$2a$12$DcOIIQe5p8xUKzfy41pdIOiAp34ma7NDmj/jJXVVYDpEwfaI676oq', 'admin@moodbuds.local', 'Test Admin', 1, 1, 0, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('owner', '$2a$12$DcOIIQe5p8xUKzfy41pdIOiAp34ma7NDmj/jJXVVYDpEwfaI676oq', 'owner@moodbuds.local', 'Owner Admin', 1, 1, 0, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('admin', '$2a$12$DcOIIQe5p8xUKzfy41pdIOiAp34ma7NDmj/jJXVVYDpEwfaI676oq', 'admin2@moodbuds.local', 'Admin User', 1, 1, 0, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

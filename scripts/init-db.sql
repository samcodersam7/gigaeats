-- GigaEats Database Initialization Script
-- This script creates the basic database structure for development

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS user_service;
CREATE SCHEMA IF NOT EXISTS vendor_service;
CREATE SCHEMA IF NOT EXISTS order_service;
CREATE SCHEMA IF NOT EXISTS payment_service;
CREATE SCHEMA IF NOT EXISTS integration_service;

-- Set default search path
SET search_path TO public, user_service, vendor_service, order_service, payment_service, integration_service;

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'sales_agent', 'vendor', 'end_customer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended', 'banned');
CREATE TYPE vendor_status AS ENUM ('pending_approval', 'approved', 'rejected', 'suspended', 'inactive');
CREATE TYPE vendor_type AS ENUM ('restaurant', 'catering', 'bakery', 'food_truck', 'cloud_kitchen');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');

-- Users table (user_service schema)
CREATE TABLE IF NOT EXISTS user_service.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'sales_agent',
    status user_status NOT NULL DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_service.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(500),
    bio TEXT,
    address JSONB,
    preferences JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table (vendor_service schema)
CREATE TABLE IF NOT EXISTS vendor_service.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_registration VARCHAR(100),
    vendor_type vendor_type NOT NULL,
    status vendor_status NOT NULL DEFAULT 'pending_approval',
    description TEXT,
    cuisine_types TEXT[],
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    operating_hours JSONB,
    halal_certified BOOLEAN DEFAULT FALSE,
    minimum_order_value DECIMAL(10,2),
    delivery_radius INTEGER, -- in kilometers
    commission_rate DECIMAL(5,2) DEFAULT 7.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON user_service.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON user_service.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON user_service.users(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_service.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendor_service.vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendor_service.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendor_service.vendors(vendor_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON user_service.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_service.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendor_service.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO user_service.users (email, password_hash, first_name, last_name, role, status, email_verified)
VALUES (
    'admin@gigaeats.com',
    '$2b$10$rQZ8kHWKQYXHjQJ5QJ5QJeQJ5QJ5QJ5QJ5QJ5QJ5QJ5QJ5QJ5QJ5Q', -- admin123
    'System',
    'Administrator',
    'admin',
    'active',
    TRUE
) ON CONFLICT (email) DO NOTHING;

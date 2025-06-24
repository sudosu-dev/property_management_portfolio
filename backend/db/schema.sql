DROP TABLE IF EXISTS maintenance_photos CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS utility_information CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

CREATE TABLE properties(
    id SERIAL PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    total_units INTEGER NOT NULL
);

CREATE TABLE units(
    id SERIAL PRIMARY KEY, 
    property_id INTEGER REFERENCES properties(id) NOT NULL, 
    unit_number INTEGER UNIQUE NOT NULL,
    rent_amount DECIMAL(10, 2),
    notes TEXT,
    tenants VARCHAR(255)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    unit INTEGER REFERENCES units(id) NOT NULL,
    is_manager BOOLEAN NOT NULL,
    is_current_user BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    announcement TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    announcement_type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'approved',
    publish_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    unit_id INTEGER REFERENCES units(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255) UNIQUE NULL
);

CREATE TABLE settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utility_information(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    water_cost DECIMAL(10, 2),
    water_usage DECIMAL,
    electric_usage DECIMAL,
    electric_cost DECIMAL(10, 2),
    gas_cost DECIMAL(10, 2),
    gas_usage DECIMAL,
    due_date DATE,
    paid_date TIMESTAMP,
    is_posted_to_ledger BOOLEAN NOT NULL DEFAULT false,
    paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_requests(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    img_url TEXT,
    information TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    unit_number INTEGER REFERENCES units(id) NOT NULL, 
    completed_at TIMESTAMP
);

CREATE TABLE maintenance_photos (
    id SERIAL PRIMARY KEY,
    maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE, 
    photo_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Skema Database SPK & Portal Advisory SmartInfra
CREATE DATABASE IF NOT EXISTS smartinfra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartinfra_db;

-- 1. Tabel Administrator & Pengguna
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Profil Pengguna (Dapat Dikelola di Admin)
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'school',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Kriteria
CREATE TABLE IF NOT EXISTS criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE, -- C1, C2, dst
    name VARCHAR(100) NOT NULL,
    type ENUM('benefit', 'cost') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Bobot Kriteria per Profil
CREATE TABLE IF NOT EXISTS profile_criteria_weights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    criterion_id INT NOT NULL,
    weight DECIMAL(5, 4) NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (criterion_id) REFERENCES criteria(id) ON DELETE CASCADE,
    UNIQUE KEY uq_profile_criterion (profile_id, criterion_id)
);

-- 5. Tabel Alternatif Infrastruktur Server & Dedicated AI GPU Rig (Alternatif SAW)
CREATE TABLE IF NOT EXISTS laptops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    price DECIMAL(15, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 10,
    processor_name VARCHAR(150),
    processor_score DECIMAL(5, 2) NOT NULL DEFAULT 80.00,
    ram_gb INT NOT NULL,
    storage_desc VARCHAR(150),
    storage_gb INT NOT NULL DEFAULT 512,
    gpu_name VARCHAR(150),
    gpu_score DECIMAL(5, 2) NOT NULL DEFAULT 70.00,
    battery_hours DECIMAL(4, 1) NOT NULL DEFAULT 10.0,
    weight_kg DECIMAL(4, 2) NOT NULL DEFAULT 1.40,
    screen_desc VARCHAR(150) DEFAULT NULL,
    image_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Tabel Nilai Matriks Kriteria (Skor Konversi SAW)
CREATE TABLE IF NOT EXISTS laptop_criteria_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    laptop_id INT NOT NULL,
    criterion_id INT NOT NULL,
    raw_value DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (laptop_id) REFERENCES laptops(id) ON DELETE CASCADE,
    FOREIGN KEY (criterion_id) REFERENCES criteria(id) ON DELETE CASCADE,
    UNIQUE KEY uq_laptop_criterion (laptop_id, criterion_id)
);

-- 7. Tabel Pesanan (Guest Checkout & Customer)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    paid_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Rincian Item Pesanan
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    laptop_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (laptop_id) REFERENCES laptops(id) ON DELETE RESTRICT
);

-- 9. Tabel Simulasi Pembayaran
CREATE TABLE IF NOT EXISTS simulated_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    pay_code VARCHAR(100) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'success') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

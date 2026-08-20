-- =========================================================
-- VolunTree Database Schema
-- Menunjukkan: rancangan entitas & relasi antar entitas, SQL
-- =========================================================

CREATE DATABASE IF NOT EXISTS voluntree_db;
USE voluntree_db;

-- 1. USERS: menyimpan volunteer, pengelola organisasi, dan admin
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150)      NOT NULL,
  email         VARCHAR(150)      NOT NULL UNIQUE,
  password_hash VARCHAR(255)      NOT NULL,
  role          ENUM('volunteer','organization','admin') NOT NULL DEFAULT 'volunteer',
  phone         VARCHAR(20)       NULL,
  avatar_url    VARCHAR(255)      NULL,
  created_at    TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ORGANIZATIONS: 1-1 dengan users yang punya role 'organization'
CREATE TABLE organizations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  org_name      VARCHAR(150) NOT NULL,
  description   TEXT NULL,
  address       VARCHAR(255) NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_org_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. CATEGORIES: kategori kegiatan volunteer (mis. Lingkungan, Pendidikan, Bencana)
CREATE TABLE categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 4. EVENTS: kegiatan volunteer yang dibuat oleh organisasi (1 organization -> N events)
CREATE TABLE events (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  category_id     INT NULL,
  title           VARCHAR(180) NOT NULL,
  description     TEXT NOT NULL,
  location        VARCHAR(255) NOT NULL,
  quota           INT NOT NULL DEFAULT 10,
  event_date      DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  status          ENUM('draft','published','closed','completed') DEFAULT 'published',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. REGISTRATIONS: tabel penghubung many-to-many antara users (volunteer) dan events
CREATE TABLE registrations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  event_id    INT NOT NULL,
  user_id     INT NOT NULL,
  status      ENUM('pending','approved','rejected','attended') DEFAULT 'pending',
  notes       VARCHAR(255) NULL,
  applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT uq_event_user UNIQUE (event_id, user_id) -- 1 volunteer hanya bisa daftar 1x per event
) ENGINE=InnoDB;

-- =========================================================
-- Contoh query SQL (JOIN, aggregate, filter) untuk demo kompetensi "Menggunakan SQL"
-- =========================================================

-- Daftar event beserta jumlah pendaftar & sisa kuota
-- SELECT e.id, e.title, e.quota,
--        COUNT(r.id) AS total_pendaftar,
--        (e.quota - COUNT(r.id)) AS sisa_kuota
-- FROM events e
-- LEFT JOIN registrations r ON r.event_id = e.id AND r.status IN ('pending','approved')
-- GROUP BY e.id;

-- Volunteer paling aktif (jumlah event yang diikuti)
-- SELECT u.full_name, COUNT(r.id) AS jumlah_event
-- FROM users u
-- JOIN registrations r ON r.user_id = u.id
-- WHERE r.status = 'approved'
-- GROUP BY u.id
-- ORDER BY jumlah_event DESC
-- LIMIT 5;

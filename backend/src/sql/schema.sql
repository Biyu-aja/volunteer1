-- =========================================================
-- VolunTree Database Schema (PostgreSQL)
-- Menunjukkan: rancangan entitas & relasi antar entitas, SQL
-- =========================================================

-- Note: Buat database terlebih dahulu di PostgreSQL:
-- CREATE DATABASE voluntree_db;

-- Bersihkan tabel & tipe jika ada sebelumnya (untuk kebutuhan seeding/reset manual)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS enum_users_role CASCADE;
DROP TYPE IF EXISTS enum_events_status CASCADE;
DROP TYPE IF EXISTS enum_registrations_status CASCADE;

-- Membuat Tipe ENUM untuk PostgreSQL (menyamakan penamaan otomatis Sequelize)
CREATE TYPE enum_users_role AS ENUM ('volunteer', 'organization', 'admin');
CREATE TYPE enum_events_status AS ENUM ('draft', 'published', 'closed', 'completed');
CREATE TYPE enum_registrations_status AS ENUM ('pending', 'approved', 'rejected', 'attended');

-- 1. USERS: menyimpan volunteer, pengelola organisasi, dan admin
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(150)      NOT NULL,
  email         VARCHAR(150)      NOT NULL UNIQUE,
  password_hash VARCHAR(255)      NOT NULL,
  role          enum_users_role   NOT NULL DEFAULT 'volunteer',
  phone         VARCHAR(20)       NULL,
  avatar_url    VARCHAR(255)      NULL,
  created_at    TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP         DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZATIONS: 1-1 dengan users yang punya role 'organization'
CREATE TABLE organizations (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL UNIQUE,
  org_name      VARCHAR(150) NOT NULL,
  description   TEXT NULL,
  address       VARCHAR(255) NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_org_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. CATEGORIES: kategori kegiatan volunteer (mis. Lingkungan, Pendidikan, Bencana)
CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

-- 4. EVENTS: kegiatan volunteer yang dibuat oleh organisasi (1 organization -> N events)
CREATE TABLE events (
  id              SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  category_id     INTEGER NULL,
  title           VARCHAR(180) NOT NULL,
  description     TEXT NOT NULL,
  location        VARCHAR(255) NOT NULL,
  quota           INTEGER NOT NULL DEFAULT 10,
  event_date      DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  status          enum_events_status DEFAULT 'published',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. REGISTRATIONS: tabel penghubung many-to-many antara users (volunteer) dan events
CREATE TABLE registrations (
  id          SERIAL PRIMARY KEY,
  event_id    INTEGER NOT NULL,
  user_id     INTEGER NOT NULL,
  status      enum_registrations_status DEFAULT 'pending',
  notes       VARCHAR(255) NULL,
  applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT uq_event_user UNIQUE (event_id, user_id) -- 1 volunteer hanya bisa daftar 1x per event
);

-- =========================================================
-- Contoh query SQL (JOIN, aggregate, filter) untuk demo kompetensi "Menggunakan SQL"
-- =========================================================

-- Daftar event beserta jumlah pendaftar & sisa kuota
-- SELECT e.id, e.title, e.quota,
--        COUNT(r.id) AS total_pendaftar,
--        (e.quota - COUNT(r.id)) AS sisa_kuota
-- FROM events e
-- LEFT JOIN registrations r ON r.event_id = e.id AND r.status IN ('pending','approved')
-- GROUP BY e.id, e.title, e.quota
-- ORDER BY total_pendaftar DESC;

-- Volunteer paling aktif (jumlah event yang diikuti)
-- SELECT u.full_name, COUNT(r.id) AS jumlah_event
-- FROM users u
-- JOIN registrations r ON r.user_id = u.id
-- WHERE r.status = 'approved'
-- GROUP BY u.id, u.full_name
-- ORDER BY jumlah_event DESC
-- LIMIT 5;

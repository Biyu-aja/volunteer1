-- =========================================================================
-- MIGRATION SCRIPT: VolunTree Database Schema Simplification
-- =========================================================================
-- Gunakan script ini pada database production Anda untuk:
-- 1. Mengubah semua user ber-role 'organization' menjadi 'admin'
-- 2. Menghapus ketergantungan 'organization_id' pada tabel events
-- 3. Menghapus tabel organizations secara aman
-- 4. Memperbarui tipe data ENUM enum_users_role (menghapus opsi 'organization')
-- =========================================================================

BEGIN;

-- 1. Ubah role user organisasi lama menjadi admin
UPDATE users SET role = 'admin' WHERE role = 'organization';

-- 2. Hapus constraint foreign key dan kolom organization_id dari tabel events
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_organization_id_fkey;
ALTER TABLE events DROP COLUMN IF EXISTS organization_id;

-- 3. Hapus tabel organizations
DROP TABLE IF EXISTS organizations CASCADE;

-- 4. Perbarui enum_users_role untuk menghapus opsi 'organization'
-- Ubah nama enum lama
ALTER TYPE enum_users_role RENAME TO enum_users_role_old;

-- Buat enum baru dengan hanya role 'volunteer' dan 'admin'
CREATE TYPE enum_users_role AS ENUM ('volunteer', 'admin');

-- Ubah tipe kolom di tabel users dengan casting
ALTER TABLE users 
    ALTER COLUMN role TYPE enum_users_role 
    USING role::text::enum_users_role;

-- Hapus enum lama
DROP TYPE enum_users_role_old;

COMMIT;

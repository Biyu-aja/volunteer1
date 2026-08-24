CREATE DATABASE voluntree_db;

CREATE TYPE enum_users_role AS ENUM (
    'volunteer',
    'admin'
);

CREATE TYPE enum_events_status AS ENUM (
    'draft',
    'published',
    'closed',
    'completed'
);

CREATE TYPE enum_registrations_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'attended'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role enum_users_role NOT NULL DEFAULT 'volunteer',
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    category_id INTEGER,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    quota INTEGER NOT NULL DEFAULT 10,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status enum_events_status DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status enum_registrations_status DEFAULT 'pending',
    notes VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (event_id, user_id)
);
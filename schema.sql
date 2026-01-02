CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image VARCHAR(255),
    slug VARCHAR(255) UNIQUE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    category_id INTEGER REFERENCES categories(id),
    featured BOOLEAN DEFAULT false,
    reviews JSONB,
    quotes JSONB,
    purchase_urls JSONB,
    faqs JSONB,
    slug VARCHAR(255) UNIQUE
);

CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(id),
    author_id INTEGER REFERENCES authors(id),
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE book_tags (
    book_id INTEGER REFERENCES books(id),
    tag_id INTEGER REFERENCES tags(id),
    PRIMARY KEY (book_id, tag_id)
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image VARCHAR(255),
    published_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES authors(id),
    slug VARCHAR(255) UNIQUE
);

CREATE TABLE pages (
    slug VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    structured_content JSONB
);

CREATE TABLE popups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT,
    display_delay INTEGER DEFAULT 0,
    display_duration INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE general_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'libribooks.com',
    tagline VARCHAR(500),
    support_email VARCHAR(255),
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500)
);

INSERT INTO general_settings (site_name, tagline, support_email, logo_url, favicon_url) VALUES ('libribooks.com', NULL, NULL, NULL, NULL);

CREATE TABLE seo_settings (
    id SERIAL PRIMARY KEY,
    default_title VARCHAR(255),
    meta_description VARCHAR(500),
    global_keywords TEXT,
    enable_schema BOOLEAN DEFAULT true
);

INSERT INTO seo_settings (default_title, meta_description, global_keywords, enable_schema) VALUES ('libribooks.com', 'Discover your next favorite book with our insightful reviews, articles, and author interviews.', 'books, reviews, articles, authors', true);

CREATE TABLE appearance_settings (
    id SERIAL PRIMARY KEY,
    enable_dark_mode BOOLEAN DEFAULT true,
    headline_font VARCHAR(255) DEFAULT 'space_grotesk',
    body_font VARCHAR(255) DEFAULT 'literata',
    color_primary VARCHAR(255) DEFAULT '201 41% 55%',
    color_background VARCHAR(255) DEFAULT '0 0% 100%',
    color_accent VARCHAR(255) DEFAULT '201 41% 55%',
    quick_links JSONB DEFAULT '[]'::jsonb,
    legal_links JSONB DEFAULT '[]'::jsonb
);

INSERT INTO appearance_settings (enable_dark_mode, headline_font, body_font, color_primary, color_background, color_accent, quick_links, legal_links) VALUES (true, 'space_grotesk', 'literata', '201 41% 55%', '0 0% 100%', '201 41% 55%', '[]'::jsonb, '[]'::jsonb);

CREATE TABLE routing_settings (
    id SERIAL PRIMARY KEY,
    base_url VARCHAR(500) DEFAULT 'https://libribooks.com',
    permalink_structure VARCHAR(50) DEFAULT 'book',
    enable_canonical BOOLEAN DEFAULT true
);

INSERT INTO routing_settings (base_url, permalink_structure, enable_canonical) VALUES ('https://libribooks.com', 'book', true);

CREATE TABLE integrations_settings (
    id SERIAL PRIMARY KEY,
    google_analytics_id VARCHAR(255),
    facebook_pixel_id VARCHAR(255),
    custom_api_key VARCHAR(255)
);

INSERT INTO integrations_settings (google_analytics_id, facebook_pixel_id, custom_api_key) VALUES (NULL, NULL, NULL);

-- New table for site settings
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL,
    welcome_message TEXT,
    welcome_text TEXT,
    about_site TEXT,
    social_media_links JSONB
);

-- Insert default values for the new site_settings table
INSERT INTO site_settings (site_name, welcome_message, welcome_text, about_site, social_media_links) VALUES ('libribooks.com', 'Welcome to LibriBooks!', 'Explore our vast collection of books and discover your next literary adventure.', 'LibriBooks is your friendly corner of the internet for discovering amazing books and sharing the love of reading.', '{"twitter": "", "facebook": "", "youtube": "", "linkedin": ""}');

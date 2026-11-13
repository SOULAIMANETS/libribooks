-- Add slug column to authors table
ALTER TABLE authors ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Function to generate slug (simple version)
CREATE OR REPLACE FUNCTION generate_slug(name TEXT) RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing authors with slugs if they don't have one
UPDATE authors 
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Make slug NOT NULL after migration
ALTER TABLE authors ALTER COLUMN slug SET NOT NULL;

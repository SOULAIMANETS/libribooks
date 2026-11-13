-- ------------------------------------------------------------
-- 04_author_slugs.sql
-- Add slug column to authors and generate from name
-- ------------------------------------------------------------

-- Add the column (if it does not exist)
ALTER TABLE public.authors
    ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Function to generate a simple slug
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Populate slugs for existing authors
UPDATE public.authors
SET slug = generate_slug(name)
WHERE slug IS NULL;
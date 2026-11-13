-- ------------------------------------------------------------
-- 02_articles_id.sql
-- Add a serial id column as primary key; keep slug UNIQUE
-- ------------------------------------------------------------

-- Add the id column if it does not already exist
ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS id SERIAL;

-- Make id the primary key (only if there is no existing PK,
-- or if the existing PK is not already named articles_pkey)
DO $$
DECLARE
    pk_name TEXT;
BEGIN
    SELECT conname INTO pk_name
    FROM pg_constraint
    WHERE conrelid = 'public.articles'::regclass
      AND contype = 'p';

    IF pk_name IS NULL THEN
        -- No PK yet → make id the PK
        ALTER TABLE public.articles ADD PRIMARY KEY (id);
    ELSIF pk_name != 'articles_pkey' THEN
        -- PK exists but is not the default name → drop it and recreate on id
        EXECUTE 'ALTER TABLE public.articles DROP CONSTRAINT ' || quote_ident(pk_name);
        ALTER TABLE public.articles ADD PRIMARY KEY (id);
    END IF;
END $$;

-- Ensure slug remains unique (SEO‑friendly URLs)
ALTER TABLE public.articles
    ADD CONSTRAINT articles_slug_unique UNIQUE (slug);
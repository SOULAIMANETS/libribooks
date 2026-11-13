-- ------------------------------------------------------------
-- 03_add_missing_columns.sql
-- Add columns that may be missing from the articles table
-- ------------------------------------------------------------

ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS keyword_links JSONB DEFAULT '[]';

ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS meta_description TEXT;
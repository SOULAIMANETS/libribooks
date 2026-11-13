-- 06_seo_ai_enhancements.sql
-- Add ai_summary TEXT and rating NUMERIC(3,2) to books and articles if missing

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);
-- COMPREHENSIVE FIX FOR ARTICLES TABLE
-- Run this in your Supabase SQL Editor

-- 1. Ensure the 'id' column exists and is the primary key
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'id') THEN
        ALTER TABLE public.articles ADD COLUMN id SERIAL;
    END IF;
END $$;

-- 2. Make 'id' the primary key if it isn't already
-- This is a bit complex if there's an existing PK. We'll check if slug is the PK.
DO $$
DECLARE
    pk_name TEXT;
BEGIN
    SELECT conname INTO pk_name
    FROM pg_constraint
    WHERE conrelid = 'public.articles'::regclass AND contype = 'p';

    IF pk_name IS NOT NULL AND pk_name != 'articles_pkey' THEN
        -- If PK is not 'articles_pkey' (likely it's on slug), we might need to drop it and recreate on id
        -- But for safety, we'll just ensure id is PRIMARY KEY IF no PK exists
        NULL; 
    ELSIF pk_name IS NULL THEN
        ALTER TABLE public.articles ADD PRIMARY KEY (id);
    END IF;
END $$;

-- 3. Ensure other required columns exist
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS keyword_links JSONB DEFAULT '[]';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS skill_slug TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS article_role TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_name TEXT; -- Just in case

-- 4. Ensure RLS is enabled and policies are correct
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read articles" ON public.articles;
DROP POLICY IF EXISTS "Admin Write articles" ON public.articles;
DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
DROP POLICY IF EXISTS "Admin Write Articles" ON public.articles;

-- Re-create is_admin if it doesn't exist (safety)
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND LOWER(role) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply fresh policies
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admin Write Articles" ON public.articles FOR ALL USING (public.is_admin());

-- 5. Grant permissions
GRANT ALL ON public.articles TO authenticated, service_role;
GRANT SELECT ON public.articles TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

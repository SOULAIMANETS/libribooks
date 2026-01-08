
-- Fix Row Level Security (RLS) for Pages Table

-- 1. Ensure RLS is enabled
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- 2. Drop any conflicting or incorrect old policies
DROP POLICY IF EXISTS "Public Read Pages" ON public.pages;
DROP POLICY IF EXISTS "Admin Write Pages" ON public.pages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pages;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.pages;

-- 3. Create Policy: Allow Public Read Access
CREATE POLICY "Enable read access for all users" ON public.pages
FOR SELECT USING (true);

-- 4. Create Policy: Allow Authenticated Users to Edit
CREATE POLICY "Enable full access for authenticated users" ON public.pages
FOR ALL USING (auth.role() = 'authenticated');

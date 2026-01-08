
-- Fix Row Level Security (RLS) for Settings Table

-- 1. Ensure RLS is enabled
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any conflicting or incorrect old policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.settings;
DROP POLICY IF EXISTS "Admin Write Settings" ON public.settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.settings;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.settings;

-- 3. Create Policy: Allow Public Read Access
-- (Everyone needs to read settings to see the site properly)
CREATE POLICY "Enable read access for all users" ON public.settings
FOR SELECT USING (true);

-- 4. Create Policy: Allow Authenticated Users to Edit
-- (Any user validly logged in via Supabase Auth can change settings)
CREATE POLICY "Enable full access for authenticated users" ON public.settings
FOR ALL USING (auth.role() = 'authenticated');

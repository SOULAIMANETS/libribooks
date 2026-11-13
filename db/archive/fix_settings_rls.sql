
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

-- 4. Create Policy: Allow Authenticated Users to Insert
CREATE POLICY "Enable insert for authenticated users" ON public.settings
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Create Policy: Allow Authenticated Users to Update
CREATE POLICY "Enable update for authenticated users" ON public.settings
FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 6. Create Policy: Allow Authenticated Users to Delete
CREATE POLICY "Enable delete for authenticated users" ON public.settings
FOR DELETE USING (auth.role() = 'authenticated');

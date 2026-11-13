-- ROOT CAUSE FIX FOR LIBRIBOOKS PERMISSIONS (V2 - Fix Type Mismatch)
-- This script addresses:
-- 1. "operator does not exist: uuid = integer" error (by migrating public.users to UUID)
-- 2. "permission denied" errors (by fixing RLS)

-- ==========================================
-- 1. MIGRATE USERS TABLE to UUID
-- ==========================================
-- We must recreate public.users to match Supabase Auth UUIDs.
-- Existing "integer" ID users (dummy data) will be removed, ensuring clean state.

DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS immediately
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Backfill existing Auth users into public.users
-- This ensures you (and other signed-up users) have a profile immediately.
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', email),
  COALESCE(raw_user_meta_data->>'role', 'user')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. ROBUST IS_ADMIN FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
DECLARE
  current_user_role text;
BEGIN
  SELECT role INTO current_user_role
  FROM public.users
  WHERE id = auth.uid(); -- Now safe: UUID = UUID
  
  RETURN (lower(current_user_role) = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 

-- ==========================================
-- 3. AUTO-SYNC USER TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    role = COALESCE(EXCLUDED.role, public.users.role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. RESET & APPLY RLS POLICIES
-- ==========================================
DO $$ 
DECLARE 
    tbl text;
    tables text[] := ARRAY['books', 'authors', 'categories', 'tags', 'articles', 'pages', 'settings'];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(tbl) || ' ENABLE ROW LEVEL SECURITY';
        EXECUTE 'DROP POLICY IF EXISTS "Public Read ' || tbl || '" ON public.' || quote_ident(tbl);
        EXECUTE 'DROP POLICY IF EXISTS "Admin Write ' || tbl || '" ON public.' || quote_ident(tbl);
        
        EXECUTE 'CREATE POLICY "Public Read ' || tbl || '" ON public.' || quote_ident(tbl) || ' FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "Admin Write ' || tbl || '" ON public.' || quote_ident(tbl) || ' FOR ALL USING (public.is_admin())';
    END LOOP;
END $$;

-- Junction Tables
ALTER TABLE public.book_authors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read book_authors" ON public.book_authors;
DROP POLICY IF EXISTS "Admin Write book_authors" ON public.book_authors;
CREATE POLICY "Public Read book_authors" ON public.book_authors FOR SELECT USING (true);
CREATE POLICY "Admin Write book_authors" ON public.book_authors FOR ALL USING (public.is_admin());

ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read book_tags" ON public.book_tags;
DROP POLICY IF EXISTS "Admin Write book_tags" ON public.book_tags;
CREATE POLICY "Public Read book_tags" ON public.book_tags FOR SELECT USING (true);
CREATE POLICY "Admin Write book_tags" ON public.book_tags FOR ALL USING (public.is_admin());

-- Users Policies
DROP POLICY IF EXISTS "Read Own or Admin" ON public.users;
DROP POLICY IF EXISTS "Update Own or Admin" ON public.users;
CREATE POLICY "Read Own or Admin" ON public.users FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Update Own or Admin" ON public.users FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Messages Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert Messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Manage Messages" ON public.messages;
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Messages" ON public.messages FOR ALL USING (public.is_admin());

-- Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

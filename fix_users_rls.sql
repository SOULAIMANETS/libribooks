-- FIX RLS POLICIES FOR USER MANAGEMENT
-- This script allows administrators to see all users and makes role checks case-insensitive.

-- 1. Drop existing restrictive policies on the users table
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- 2. Create new policies for the users table
-- Allow users to read and update their own data
CREATE POLICY "Users can read own data" ON public.users 
FOR SELECT USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own data" ON public.users 
FOR UPDATE USING (email = (auth.jwt() ->> 'email'));

-- Allow Administrators to read and manage all users
CREATE POLICY "Admins can manage all users" ON public.users 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE email = (auth.jwt() ->> 'email') 
        AND LOWER(role) = 'admin'
    )
);

-- 3. Fix Other Policies to be case-insensitive for 'admin' role
-- Note: Replace existing policies if they exist.
-- We'll use a helper to identify admins.
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

-- Update other tables to use the is_admin() function
DROP POLICY IF EXISTS "Admin Write Categories" ON public.categories;
CREATE POLICY "Admin Write Categories" ON public.categories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Books" ON public.books;
CREATE POLICY "Admin Write Books" ON public.books FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Authors" ON public.authors;
CREATE POLICY "Admin Write Authors" ON public.authors FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write BookAuthors" ON public.book_authors;
CREATE POLICY "Admin Write BookAuthors" ON public.book_authors FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write BookTags" ON public.book_tags;
CREATE POLICY "Admin Write BookTags" ON public.book_tags FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Tags" ON public.tags;
CREATE POLICY "Admin Write Tags" ON public.tags FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Articles" ON public.articles;
CREATE POLICY "Admin Write Articles" ON public.articles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Pages" ON public.pages;
CREATE POLICY "Admin Write Pages" ON public.pages FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write PopupAds" ON public.popup_ads;
CREATE POLICY "Admin Write PopupAds" ON public.popup_ads FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Write Settings" ON public.settings;
CREATE POLICY "Admin Write Settings" ON public.settings FOR ALL USING (public.is_admin());

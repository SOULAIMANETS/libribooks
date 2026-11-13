-- SECURITY FIXES FOR LIBRIBOOKS SUPABASE
-- Run this script in your Supabase SQL Editor to fix the reported security issues.

-- 1. Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies
-- We generally allow PUBLIC READ access for content, but ADMIN ONLY WRITE access.
-- Admins are identified by checking the 'users' table for a role of 'admin'.
-- Using EMAIL matching because public.users.id (Integer) likely doesn't match auth.users.id (UUID).

-- USERS TABLE
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (email = (auth.jwt() ->> 'email'));
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (email = (auth.jwt() ->> 'email'));

-- CATEGORIES
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin Write Categories" ON public.categories FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- BOOKS
CREATE POLICY "Public Read Books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admin Write Books" ON public.books FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- AUTHORS
CREATE POLICY "Public Read Authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admin Write Authors" ON public.authors FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- BOOK_AUTHORS
CREATE POLICY "Public Read BookAuthors" ON public.book_authors FOR SELECT USING (true);
CREATE POLICY "Admin Write BookAuthors" ON public.book_authors FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- BOOK_TAGS
CREATE POLICY "Public Read BookTags" ON public.book_tags FOR SELECT USING (true);
CREATE POLICY "Admin Write BookTags" ON public.book_tags FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- TAGS
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admin Write Tags" ON public.tags FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- ARTICLES
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admin Write Articles" ON public.articles FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- PAGES
CREATE POLICY "Public Read Pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admin Write Pages" ON public.pages FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- POPUP ADS
CREATE POLICY "Public Read PopupAds" ON public.popup_ads FOR SELECT USING (true);
CREATE POLICY "Admin Write PopupAds" ON public.popup_ads FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

-- SETTINGS
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin Write Settings" ON public.settings FOR ALL USING (exists (select 1 from public.users where email = (auth.jwt() ->> 'email') and role = 'admin'));

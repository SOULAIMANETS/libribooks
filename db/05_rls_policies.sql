-- ------------------------------------------------------------
-- 05_rls_policies.sql
-- Consolidated RLS policies for the entire libribooks database
-- ------------------------------------------------------------

-- -----------------------------------------------------------------
-- 1️⃣ Enable RLS on every table (idempotent – safe to re‑run)
-- -----------------------------------------------------------------
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_authors     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popup_ads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages         ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------
-- 2️⃣ Drop *all* existing policies (starts from a clean slate)
-- -----------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname, tablename
             FROM pg_policies
             WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname)
                 || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- -----------------------------------------------------------------
-- 3️⃣ Create the new, hardened policies
-- -----------------------------------------------------------------

-- Public Read on every table (anonymous users can read)
FOREACH tbl IN ARRAY ARRAY['categories','books','book_authors','authors',
                           'book_tags','tags','articles','pages','popup_ads','settings']
LOOP
    EXECUTE '
        CREATE POLICY ''Public Read ' || tbl || ''''
        || ' ON public.' || quote_ident(tbl) || '
        FOR SELECT USING (true);
    ';
END LOOP;

-- Admin Write on every table (only users with role='admin')
FOREACH tbl IN ARRAY ARRAY['categories','books','book_authors','authors',
                           'book_tags','tags','articles','pages','popup_ads','settings']
LOOP
    EXECUTE '
        CREATE POLICY ''Admin Write ' || tbl || ''''
        || ' ON public.' || quote_ident(tbl) || '
        FOR ALL USING (public.is_admin());
    ';
END LOOP;

-- -----------------------------------------------------------------
-- 4️⃣ Special policies
-- -----------------------------------------------------------------

-- Users can read / update their own row
CREATE POLICY "Users can read own data"
    ON public.users FOR SELECT
    USING (email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own data"
    ON public.users FOR UPDATE
    USING (email = (auth.jwt() ->> 'email'));

-- Admins can manage all users (full control)
CREATE POLICY "Admins can manage all users"
    ON public.users FOR ALL
    USING (public.is_admin());

-- Messages: public may insert (contact form) with simple length check
CREATE POLICY "Allow public insertion of messages"
    ON public.messages FOR INSERT
    WITH CHECK (LENGTH(name) > 0 AND LENGTH(email) > 0 AND LENGTH(message) > 0);

-- Admins can manage all messages
CREATE POLICY "Admins can manage all messages"
    ON public.messages FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------
-- 5️⃣ Grant schema‑level permissions (required for anon / auth)
-- -----------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public
    TO authenticated, service_role;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
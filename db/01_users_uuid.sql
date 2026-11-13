-- ------------------------------------------------------------
-- 01_users_uuid.sql
-- Migrate public.users to UUID type matching auth.users
-- ------------------------------------------------------------

-- 1️⃣ Check for foreign‑key references to public.users
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY'
        AND  table_schema = 'public'
        AND referenced_table_name = 'users'
    )
    THEN
        RAISE NOTICE '⚠️  Foreign‑key constraints exist on public.users.
Please review the constraints above before dropping the table.
-- If you wish to auto‑drop them, uncomment the block below:
-- FOR item IN
--     SELECT table_name, constraint_name
--     FROM information_schema.table_constraints
--     WHERE constraint_type = ''FOREIGN KEY''
--       AND referenced_table_name = ''users''
-- LOOP
--     EXECUTE ''ALTER TABLE '' || table_name || '' DROP CONSTRAINT '' || constraint_name;
-- END LOOP;
    ELSE
        RAISE NOTICE '✅  No foreign‑key constraints found on public.users. Proceeding.';
    END IF;
END $$;

-- 2️⃣ Recreate public.users with a UUID primary key
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT ''user'',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS immediately
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Back‑fill from auth.users (preserves existing profiles)
INSERT INTO public.users (id, email, name, role)
SELECT id,
       email,
       COALESCE(raw_user_meta_data->>''name'', email),
       COALESCE(raw_user_meta_data->>''role'', ''user'')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3️⃣ Ensure the admin account keeps the 'admin' role
-- ------------------------------------------------------------
UPDATE public.users
SET role = ''admin''
WHERE email = ''mr.ghermouli@gmail.com'';

-- ------------------------------------------------------------
-- 4️⃣ Trigger to keep auth.users in sync on new sign‑ups
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>''name'', new.email),
    COALESCE(new.raw_user_meta_data->>''role'', ''user'')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
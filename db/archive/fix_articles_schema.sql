-- Check current articles table schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'articles'
ORDER BY ordinal_position;

-- If 'id' column is missing, add it
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY;

-- If slug is the current primary key and you want to switch to id:
-- First, you need to drop the old primary key constraint if it exists
-- ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_pkey;
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS id SERIAL;
-- ALTER TABLE articles ADD PRIMARY KEY (id);
-- ALTER TABLE articles ADD CONSTRAINT articles_slug_unique UNIQUE (slug);

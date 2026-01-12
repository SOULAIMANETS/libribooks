
-- Add slug column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_books_slug ON books (slug);

-- Update RLS policies if necessary (it should be covered by existing policies if they use group-level access, 
-- but we should ensure 'slug' is selectable by anyone)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- If there's an existing policy for SELECT, it usually selects all columns. 
-- Just to be safe, we can refresh it or check it.

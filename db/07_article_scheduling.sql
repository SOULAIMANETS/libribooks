-- 07_article_scheduling.sql
-- Add article scheduling and status fields

-- Add status column (draft, published, scheduled)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled'));

-- Add published_at column (when article was published)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add scheduled_at column (when article should be published)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Add index for efficient querying by status and date
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON public.articles(scheduled_at) WHERE status = 'scheduled';

-- Update existing articles to have status 'published' if they have a published_at date, otherwise 'draft'
UPDATE public.articles SET status = 'published' WHERE published_at IS NOT NULL;
UPDATE public.articles SET status = 'draft' WHERE status IS NULL;
# Scripts - SEO & Monitoring

## SEO Audit Script

Run the SEO audit to verify all pages have proper metadata, JSON-LD, and AI-search readiness:

```bash
npm run seo:audit
```

Or directly:
```bash
npx tsx scripts/seo-audit.ts
```

### What it checks:
- `<title>` tag presence and length
- Meta description length (>50 chars)
- Canonical URL link
- `ai-summary` meta tag (AI-search ready)
- OpenGraph title
- Twitter card
- JSON-LD structured data blocks
- SpeakableSpecification (for voice/AI assistants)

### Expected output:
```
🔍 Libribooks SEO & AI-Search Audit

📄 Homepage (/)
   Score: 8/8 checks passed
   ✅ title: Found: "libribooks | Master 10 Essential Skills Through Books"
   ✅ description: Found (165 chars)
   ✅ canonical: Found: https://www.libribooks.com
   ✅ ai-summary: Found AI summary meta tag
   ✅ og:title: Found OpenGraph title
   ✅ twitter:card: Found Twitter card
   ✅ json-ld: 1 JSON-LD block(s) found
   ✅ speakable: Found speakable selectors

🤖 Robots.txt Check
   ✅ Sitemap reference
   ✅ Disallow rules

🗺️  Sitemap.xml Check
   ✅ 42 URL(s) found

🧠 llms.txt Check (AI Crawlers)
   ✅ Books section
   ✅ Articles section

📊 Average SEO Score: 100.0%
```

## Database Migration

Before running the site with SEO enhancements, apply the migration:

```sql
-- db/06_seo_ai_enhancements.sql
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);
```

Run this in your Supabase SQL Editor.

## Phase 3 - Recommended Next Steps

### 1. Search Console Setup
- [ ] Add property to Google Search Console: `https://www.libribooks.com`
- [ ] Submit sitemap: `https://www.libribooks.com/sitemap.xml`
- [ ] Add property to Bing Webmaster Tools
- [ ] Monitor "Index Coverage" and "Enhancements" reports

### 2. Core Web Vitals Monitoring
- [ ] Install `web-vitals` library: `npm install web-vitals`
- [ ] Create `/src/lib/analytics.ts` to send CWV metrics to your analytics endpoint
- [ ] Set up Lighthouse CI for automated performance testing

### 3. Monthly SEO Audit
- [ ] Run `npm run seo:audit` monthly
- [ ] Check Google Search Console for indexing issues
- [ ] Review rich results eligibility in Search Console "Enhancements"
- [ ] Update meta titles/descriptions for low CTR pages

### 4. AI-Search Specific
- [ ] Monitor llms.txt accessibility for AI crawlers (ChatGPT, Perplexity, Claude, Gemini)
- [ ] Test structured data with Google's Rich Results Test
- [ ] Verify speakable selectors work for voice assistants
- [ ] Check that ai_summary content is being used by AI search engines

## File Structure

```
scripts/
├── seo-audit.ts          # SEO audit script
└── README.md             # This file

db/
├── 06_seo_ai_enhancements.sql  # SEO database migration
└── archive/                # Old SQL scripts (preserved)

public/
└── robots.txt              # Bot-friendly robots.txt
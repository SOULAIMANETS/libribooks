import { db } from './src/lib/db.js';

async function fixSlugs() {
  const articles = await db.query('SELECT id, title FROM articles');
  for (const article of articles.rows) {
    const newSlug = article.title
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^\-+/, '')
      .replace(/\-+$/, '');
    await db.query('UPDATE articles SET slug = $1 WHERE id = $2', [newSlug, article.id]);
    console.log(`Fixed ${article.title} -> ${newSlug}`);
  }
  process.exit(0);
}

fixSlugs();

import { db } from './src/lib/db.js';

async function fixAuthorSlugs() {
  const authors = await db.query('SELECT id, name, slug FROM authors');
  for (const author of authors.rows) {
    let newSlug = author.slug;
    if (!newSlug) {
      // Generate new slug from name
      newSlug = author.name
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^\-+/, '')
        .replace(/\-+$/, '');
      console.log(`Setting slug for ${author.name} to ${newSlug}`);
    }
    await db.query('UPDATE authors SET slug = $1 WHERE id = $2', [newSlug, author.id]);
  }
  console.log('Author slugs fixed');
  process.exit(0);
}

fixAuthorSlugs();

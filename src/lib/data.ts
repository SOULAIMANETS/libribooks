import 'server-only';
import { db } from '@/lib/db';
import type { Book, Author } from '@/lib/types';

// Utility function to generate unique slugs for database records
export async function generateUniqueSlug(text: string, type: 'book' | 'author', table: string): Promise<string> {
  // Convert to lowercase, replace spaces and special chars with hyphens
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Ensure slug is not empty
  if (!slug) {
    slug = `${type}-${Date.now()}`;
  }

  let finalSlug = slug;
  let counter = 1;

  // Check if slug exists and make it unique
  while (true) {
    const existing = await db.query(`SELECT slug FROM ${table} WHERE slug = $1`, [finalSlug]);
    if (existing.rows.length === 0) {
      break;
    }
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

export async function getHomePageData() {
  // Fetch data from database using @vercel/postgres client
  const featuredBooksQuery = `
    SELECT
      b.id, b.title, b.slug, b.description, b.cover_image as "coverImage", b.featured, b.reviews, b.quotes, b.purchase_urls as "purchase_urls",
      c.name as category,
      array_agg(DISTINCT a.name) as authors,
      array_agg(DISTINCT a.id) as "authorIds",
      array_agg(DISTINCT t.name) as tags
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_tags bt ON b.id = bt.book_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE b.featured = true
    GROUP BY b.id, c.name
    ORDER BY b.id DESC
    LIMIT 10
  `;

  const allBooksQuery = `
    SELECT
      b.id, b.title, b.slug, b.description, b.cover_image as "coverImage", b.featured, b.reviews, b.quotes, b.purchase_urls as "purchase_urls",
      c.name as category,
      array_agg(DISTINCT a.name) as authors,
      array_agg(DISTINCT a.id) as "authorIds",
      array_agg(DISTINCT t.name) as tags
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_tags bt ON b.id = bt.book_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    GROUP BY b.id, c.name
    ORDER BY b.id DESC
  `;

  const featuredBooksRes = await db.query(featuredBooksQuery);
  const allBooksRes = await db.query(allBooksQuery);
  const authorsRes = await db.query('SELECT id, name, bio, image, slug FROM authors ORDER BY id DESC');
  const categoriesRes = await db.query('SELECT name FROM categories ORDER BY name');

  const featuredBooks: Book[] = featuredBooksRes.rows.map((book: any) => ({
    ...book,
    tags: book.tags[0] === null ? [] : book.tags,
    reviews: book.reviews || [],
    quotes: book.quotes || []
  }));

  const allBooks: Book[] = allBooksRes.rows.map((book: any) => ({
    ...book,
    tags: book.tags[0] === null ? [] : book.tags,
    reviews: book.reviews || [],
    quotes: book.quotes || []
  }));

  const authors: Author[] = authorsRes.rows.map((author: any) => ({
    ...author,
    image: author.image || '/uploads/default-author.jpg'
  }));

  const categories = ['All', ...categoriesRes.rows.map((row: any) => row.name)];

  return {
    featuredBooks,
    allBooks,
    authors,
    categories,
  };
}

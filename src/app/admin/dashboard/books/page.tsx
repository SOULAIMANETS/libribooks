import { db } from '@/lib/db';
import { BooksClient } from './books-client.tsx';
import type { Book } from '@/lib/types';

const BATCH_SIZE = 10;

async function getBooks(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const query = `
    SELECT 
      b.id, b.title, b.cover_image as "coverImage", b.featured, b.reviews, b.quotes,
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
    LIMIT $1 OFFSET $2
  `;
  const res = await db.query(query, [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM books');
  const total = parseInt(countRes.rows[0].count, 10);
  // Ensure tags are always an array and filter out null values if a book has no tags
  const books = res.rows.map(book => ({
    ...book,
    tags: book.tags[0] === null ? [] : book.tags
  }));

  const categoriesRes = await db.query('SELECT * FROM categories ORDER BY name');
  const categories = categoriesRes.rows;

  const tagsRes = await db.query('SELECT * FROM tags ORDER BY name');
  const tags = tagsRes.rows;

  const authorsRes = await db.query('SELECT id, name FROM authors ORDER BY name');
  const authors = authorsRes.rows;

  return {
    books: books as Book[],
    totalPages: Math.ceil(total / BATCH_SIZE),
    categories,
    tags,
    authors,
  };
}

export default async function BooksDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const { books, totalPages, categories, tags, authors } = await getBooks(page);
  return <BooksClient books={books} totalPages={totalPages} categories={categories} tags={tags} authors={authors} />;
}

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE books, authors, categories, book_authors, articles RESTART IDENTITY CASCADE');

    // Insert a category
    const categoryRes = await client.query(
      "INSERT INTO categories (name) VALUES ('Fiction') RETURNING id"
    );
    const categoryId = categoryRes.rows[0].id;

    // Insert an author
    const authorName = 'ghg';
    const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const authorRes = await client.query(
      "INSERT INTO authors (name, bio, image, slug) VALUES ($1, $2, $3, $4) RETURNING id",
      [authorName, 'An author of fictional books.', 'author.jpg', authorSlug]
    );
    const authorId = authorRes.rows[0].id;

    // Insert a book
    const bookTitle = 'cvvg';
    const bookSlug = bookTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const bookRes = await client.query(
      `INSERT INTO books (title, description, cover_image, category_id, featured, slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [bookTitle, 'hhhhhh jjjjjjjjjj yyyyyyyyyyyyyy ccccccccccccccccccccccc ddddddddddddd', 'https://picsum.photos/400/600?random=1', categoryId, true, bookSlug]
    );
    const bookId = bookRes.rows[0].id;

    // Link author to book
    await client.query(
      'INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)',
      [bookId, authorId]
    );

    // Insert an article
    const articleTitle = 'My First Article';
    const articleSlug = articleTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await client.query(
      `INSERT INTO articles (title, content, image, author_id, slug) VALUES ($1, $2, $3, $4, $5)`,
      [articleTitle, '<p>This is the content of my first article. It\'s a great read!</p>', 'https://picsum.photos/800/400?random=2', authorId, articleSlug]
    );

    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();

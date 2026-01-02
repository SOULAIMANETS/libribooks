const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function checkBooks() {
  try {
    const res = await pool.query('SELECT b.id, b.title, b.cover_image, LOWER(REPLACE(b.title, \' \', \'-\')) AS slug FROM books b');
    console.log('Books in database:');
    res.rows.forEach(row => {
      console.log(`- ID: ${row.id}, Title: "${row.title}", Slug: "${row.slug}", Cover: "${row.cover_image}"`);
    });

    // Check if the book has authors
    for (const book of res.rows) {
      const authorRes = await pool.query('SELECT a.name FROM authors a JOIN book_authors ba ON a.id = ba.author_id WHERE ba.book_id = $1', [book.id]);
      console.log(`  Authors for ${book.title}: ${authorRes.rows.map(r => r.name).join(', ') || 'None'}`);
    }

    // Check if the book has tags
    for (const book of res.rows) {
      const tagRes = await pool.query('SELECT t.name FROM tags t JOIN book_tags bt ON t.id = bt.tag_id WHERE bt.book_id = $1', [book.id]);
      console.log(`  Tags for ${book.title}: ${tagRes.rows.map(r => r.name).join(', ') || 'None'}`);
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await pool.end();
  }
}

checkBooks();

const pg = require('pg');
require('dotenv').config();

console.log('Loading.env.local settings:');
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? '[hidden]' : 'undefined');

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function checkDatabase() {
  try {
    console.log('\n--- Checking database connection ---');
    const client = await pool.connect();

    console.log('Connected successfully!');

    // Check books
    const booksRes = await client.query('SELECT COUNT(*) as book_count FROM books');
    console.log(`Books in database: ${booksRes.rows[0].book_count}`);

    if (booksRes.rows[0].book_count > 0) {
      const bookList = await client.query('SELECT id, title, slug FROM books');
      console.log('Book list:');
      bookList.rows.forEach(b => console.log(`  ${b.title} (slug: ${b.slug})`));
    }

    // Check articles
    const articlesRes = await client.query('SELECT COUNT(*) as article_count FROM articles');
    console.log(`Articles in database: ${articlesRes.rows[0].article_count}`);

    if (articlesRes.rows[0].article_count > 0) {
      const articleList = await client.query('SELECT id, title, slug FROM articles');
      console.log('Article list:');
      articleList.rows.forEach(a => console.log(`  ${a.title} (slug: ${a.slug})`));
    }

    client.release();
  } catch (error) {
    console.error('Error querying database:', error);

    if (error.code === 'ECONNREFUSED') {
      console.log('Database connection refused. Make sure PostgreSQL is running.');
    } else if (error.code === '42P01') {
      console.log('Tables do not exist. You may need to run schema initialization.');
    } else if (error.code === '3D000') {
      console.log(`Database "${process.env.POSTGRES_DATABASE}" does not exist.`);
    }
  } finally {
    await pool.end();
  }
}

checkDatabase();

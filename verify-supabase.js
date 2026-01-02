import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: { rejectUnauthorized: false },
});

async function verifySupabase() {
  try {
    console.log('Connecting to Supabase...');
    const client = await pool.connect();
    console.log('Connected!');

    // Check tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', tablesRes.rows.map(r => r.table_name).join(', '));

    // Check books
    const booksRes = await client.query('SELECT count(*) FROM books');
    console.log('Number of books:', booksRes.rows[0].count);

    // Check pages
    const pagesRes = await client.query('SELECT slug FROM pages');
    console.log('Pages found:', pagesRes.rows.map(r => r.slug).join(', '));

    client.release();
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    pool.end();
  }
}

verifySupabase();

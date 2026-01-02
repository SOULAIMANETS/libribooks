// Test script to debug database connection
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function debugDB() {
  try {
    console.log('Connecting to database...');
    console.log('Connection config:', {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      port: process.env.POSTGRES_PORT,
    });

    await client.connect();
    console.log('Connected successfully!');

    // Check if pages table exists
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pages'
    `);

    if (tables.rows.length === 0) {
      console.log('Pages table does not exist!');
      return;
    }

    console.log('Pages table exists!');

    // Check pages data
    const pages = await client.query('SELECT * FROM pages');
    console.log(`Found ${pages.rows.length} pages:`);
    pages.rows.forEach(page => {
      console.log(`- ${page.slug}: ${page.title}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

debugDB();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE || 'libribooks',
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.POSTGRES_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Reading schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf-8');

    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS site_settings CASCADE;
      DROP TABLE IF EXISTS integrations_settings CASCADE;
      DROP TABLE IF EXISTS routing_settings CASCADE;
      DROP TABLE IF EXISTS appearance_settings CASCADE;
      DROP TABLE IF EXISTS seo_settings CASCADE;
      DROP TABLE IF EXISTS general_settings CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS popups CASCADE;
      DROP TABLE IF EXISTS pages CASCADE;
      DROP TABLE IF EXISTS book_tags CASCADE;
      DROP TABLE IF EXISTS book_authors CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS books CASCADE;
      DROP TABLE IF EXISTS authors CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS tags CASCADE;
    `);

    console.log('Executing schema.sql...');
    await client.query(schema);

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

setupDatabase();

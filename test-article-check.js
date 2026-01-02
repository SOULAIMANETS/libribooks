const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function checkArticles() {
  try {
    const res = await pool.query('SELECT a.id, a.title, a.slug, au.name as author FROM articles a JOIN authors au ON a.author_id = au.id');
    console.log('Articles in database:');
    res.rows.forEach(row => {
      console.log(`- ID: ${row.id}, Title: "${row.title}", Slug: "${row.slug}", Author: "${row.author}"`);
    });
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await pool.end();
  }
}

checkArticles();

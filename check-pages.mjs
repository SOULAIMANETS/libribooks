import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function checkPages() {
  try {
    await client.connect();
    console.log('Connected to the database.');

    const res = await client.query('SELECT * FROM pages');
    console.log('Pages:', res.rows);
  } catch (error) {
    console.error('Error checking pages:', error);
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}

checkPages();

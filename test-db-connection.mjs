import { db } from './src/lib/db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const res = await db.query('SELECT * FROM pages');
    console.log('Pages found:', res.rows.length);
    console.log('Pages:', res.rows);
  } catch (error) {
    console.error('Error testing connection:', error);
  }
}

testConnection();

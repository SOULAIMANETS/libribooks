import { db } from './src/lib/db';
import 'dotenv/config';

async function checkSettings() {
  try {
    const result = await db.query('SELECT * FROM site_settings LIMIT 1');
    console.log('Current site_settings in DB:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Vercel Postgres doesn't require manual connection closing.
    // The pool manages connections automatically.
    // process.exit() is sufficient here to terminate the script.
    process.exit();
  }
}

checkSettings();

const { db } = require('./src/lib/db');

async function checkSettings() {
  try {
    const result = await db.query('SELECT * FROM site_settings LIMIT 1');
    console.log('Current site_settings in DB:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkSettings();

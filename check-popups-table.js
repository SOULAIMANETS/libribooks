const { Client } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

const client = new Client({
  user: process.env.POSTGRES_USER, // Use user from .env
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD, // Use password from .env
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10), // Ensure port is a number
});

async function checkPopupsTable() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if popups table exists
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'popups'");
    console.log('popups table exists:', tables.rows.length > 0);

    if (tables.rows.length > 0) {
      // Check columns in popups table
      const columns = await client.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'popups' ORDER BY ordinal_position");
      console.log('Columns in popups table:');
      columns.rows.forEach(col => {
        console.log(`  ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });

      // Check if there's any data in the table
      const data = await client.query('SELECT COUNT(*) as count FROM popups');
      console.log('Number of records in popups table:', data.rows[0].count);
    } else {
      console.log('popups table does not exist!');
    }

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkPopupsTable();

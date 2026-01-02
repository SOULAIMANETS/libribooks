const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'kick@kick',
  port: 5432,
});

async function debugUsersTable() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if libribooks database exists
    const dbs = await client.query("SELECT datname FROM pg_database WHERE datname = 'libribooks'");
    console.log('libribooks database exists:', dbs.rows.length > 0);

    if (dbs.rows.length === 0) {
      console.log('Creating libribooks database...');
      await client.query('CREATE DATABASE libribooks');
      console.log('Database created');
    }

    // Switch to libribooks database
    await client.end();
    const libriClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'libribooks',
      password: 'kick@kick',
      port: 5432,
    });
    await libriClient.connect();
    console.log('Connected to libribooks database');

    // Check users table
    const tables = await libriClient.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'users'");
    console.log('users table exists:', tables.rows.length > 0);

    if (tables.rows.length > 0) {
      // Check columns
      const columns = await libriClient.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
      console.log('Columns in users table:', columns.rows.map(col => col.column_name));

      // Check if admin user exists
      const adminUser = await libriClient.query('SELECT * FROM users WHERE email = $1', ['admin@libribooks.com']);
      console.log('Admin user exists:', adminUser.rows.length > 0);
      if (adminUser.rows.length > 0) {
        console.log('Admin user details:', {
          username: adminUser.rows[0].username,
          email: adminUser.rows[0].email,
          role: adminUser.rows[0].role,
          is_active: adminUser.rows[0].is_active
        });
      }
    }

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

debugUsersTable();

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'libribooks',
  password: 'kick@kick',
  port: 5432,
});

async function fixUsersTable() {
  try {
    await client.connect();
    console.log('Connected to libribooks database');

    // Check current columns
    const columns = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    const columnNames = columns.rows.map(col => col.column_name);
    console.log('Current columns:', columnNames);

    // Rename columns to match expected structure
    if (columnNames.includes('name')) {
      console.log('Renaming "name" column to "username"...');
      await client.query('ALTER TABLE users RENAME COLUMN name TO username');
    }

    if (columnNames.includes('password')) {
      console.log('Renaming "password" column to "password_hash"...');
      await client.query('ALTER TABLE users RENAME COLUMN password TO password_hash');
    }

    // Add missing columns
    if (!columnNames.includes('is_active')) {
      console.log('Adding is_active column...');
      await client.query('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true');
    }

    if (!columnNames.includes('created_at')) {
      console.log('Adding created_at column...');
      await client.query('ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
    }

    if (!columnNames.includes('updated_at')) {
      console.log('Adding updated_at column...');
      await client.query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
    }

    // Check final structure
    const finalColumns = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log('Final columns:', finalColumns.rows.map(col => col.column_name));

    // Create admin user with correct column names
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password', 10);

    // First, let's delete any existing admin user
    await client.query('DELETE FROM users WHERE email = $1', ['admin@libribooks.com']);

    // Insert new admin user
    await client.query(
      'INSERT INTO users (username, email, role, password_hash, is_active) VALUES ($1, $2, $3, $4, $5)',
      ['admin', 'admin@libribooks.com', 'Admin', hashedPassword, true]
    );

    console.log('Admin user created successfully');
    console.log('Email: admin@libribooks.com');
    console.log('Password: password');
    console.log('Active: Yes');

    // Verify admin user
    const adminUser = await client.query('SELECT * FROM users WHERE email = $1', ['admin@libribooks.com']);
    if (adminUser.rows.length > 0) {
      console.log('Admin user verified:', {
        username: adminUser.rows[0].username,
        email: adminUser.rows[0].email,
        role: adminUser.rows[0].role,
        is_active: adminUser.rows[0].is_active
      });
    }

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

fixUsersTable();

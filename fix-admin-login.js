const { Client } = require('pg');
const bcrypt = require('bcrypt');

// Database connection
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'kick@kick',
  port: 5432,
});

async function fixAdminLogin() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if is_active column exists
    const result = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active'");

    if (result.rows.length === 0) {
      console.log('Adding is_active column to users table...');
      await client.query('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true');
      console.log('is_active column added successfully');
    } else {
      console.log('is_active column already exists');
    }

    // Check if updated_at column exists
    const updatedAtResult = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at'");

    if (updatedAtResult.rows.length === 0) {
      console.log('Adding updated_at column to users table...');
      await client.query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
      console.log('updated_at column added successfully');
    } else {
      console.log('updated_at column already exists');
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password', 10);

    await client.query(
      'INSERT INTO users (username, email, role, password_hash, is_active) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET password_hash = $4, is_active = $5, username = $1, role = $3',
      ['admin', 'admin@libribooks.com', 'Admin', hashedPassword, true]
    );

    console.log('Admin user created/updated successfully');
    console.log('Email: admin@libribooks.com');
    console.log('Password: password');
    console.log('Active: Yes');

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

fixAdminLogin();

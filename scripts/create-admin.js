require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function createAdmin() {
  console.log('Creating admin user...');
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'password';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "Admin";
    await pool.query(
      'INSERT INTO users (username, email, role, password_hash) VALUES ($1, $2, $3, $4)',
      [username, email, role, hashedPassword]
    );
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();

const { db } = require('./src/lib/db');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Delete existing admin if any
    await db.query('DELETE FROM users WHERE email = $1', ['admin@libribooks.com']);

    // Create new admin user with hashed password
    const hashedPassword = await bcrypt.hash('password', 10);
    await db.query(
      'INSERT INTO users (username, email, role, password_hash, is_active) VALUES ($1, $2, $3, $4, $5)',
      ['admin', 'admin@libribooks.com', 'Admin', hashedPassword, true]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@libribooks.com');
    console.log('Password: password');

    // Verify creation
    const result = await db.query('SELECT id, username, email, role, is_active FROM users WHERE email = $1', ['admin@libribooks.com']);
    if (result.rows.length > 0) {
      console.log('User created:', result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function seedTags() {
  console.log('🌱 Seeding tags...');

  const tags = [
    { name: 'Classic', category_name: 'Fiction' },
    { name: 'Modern', category_name: 'Fiction' },
    { name: 'Historical', category_name: 'Non-Fiction' },
    { name: 'Autobiography', category_name: 'Biography' },
    { name: 'Space Opera', category_name: 'Science Fiction' },
    { name: 'Fantasy', category_name: 'Fiction' },
    { name: 'Thriller', category_name: 'Fiction' },
    { name: 'Self-Help', category_name: 'Non-Fiction' },
    { name: 'Science', category_name: 'Non-Fiction' },
    { name: 'Love Story', category_name: 'Romance' },
  ];

  try {
    for (const tagData of tags) {
      const categoryRes = await pool.query('SELECT id FROM categories WHERE name = $1', [tagData.category_name]);
      let categoryId = null;
      if (categoryRes.rows.length > 0) {
        categoryId = categoryRes.rows[0].id;
      } else {
        // If category doesn't exist, create it
        const newCatRes = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [tagData.category_name]);
        categoryId = newCatRes.rows[0].id;
      }

      await pool.query(
        'INSERT INTO tags (name, category_id) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [tagData.name, categoryId]
      );
      console.log(`✅ Inserted tag: ${tagData.name}`);
    }
    console.log('🎉 Tags seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
  } finally {
    await pool.end();
  }
}

seedTags();

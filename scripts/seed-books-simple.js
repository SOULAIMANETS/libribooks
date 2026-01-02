const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function seedBooks() {
  console.log('🌱 Seeding books...');

  // Add some categories first
  console.log('Adding categories...');
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Biography',
    'Science Fiction',
    'Romance'
  ];

  for (const categoryName of categories) {
    try {
      await pool.query('INSERT INTO categories (name) VALUES ($1)', [categoryName]);
    } catch (error) {
      // Ignore if already exists
    }
  }

  // Add some authors first
  console.log('Adding authors...');
  const authors = [
    { name: 'F. Scott Fitzgerald', bio: 'American novelist known for The Great Gatsby.', image: 'https://picsum.photos/200/200?random=4', slug: 'f-scott-fitzgerald' },
    { name: 'Harper Lee', bio: 'American novelist best known for To Kill a Mockingbird.', image: 'https://picsum.photos/200/200?random=5', slug: 'harper-lee' },
    { name: 'Walter Isaacson', bio: 'American biographer known for his work on Steve Jobs.', image: 'https://picsum.photos/200/200?random=6', slug: 'walter-isaacson' }
  ];

  for (const authorData of authors) {
    await pool.query(`
      INSERT INTO authors (name, bio, image, slug) VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) DO NOTHING
    `, [authorData.name, authorData.bio, authorData.image, authorData.slug]);
  }

  const books = [
    {
      title: 'The Great Gatsby',
      slug: 'great-gatsby',
      author_slug: 'f-scott-fitzgerald',
      description: 'A classic American novel set in the Jazz Age on Long Island, near New York City.',
      cover_image: 'https://picsum.photos/400/600?random=1',
      category_name: 'Fiction',
      featured: true,
      quotes: ['So we beat on, boats against the current, borne back ceaselessly into the past.'],
      purchase_urls: {
        paperback: 'https://example.com/great-gatsby-paperback',
        ebook: 'https://example.com/great-gatsby-ebook',
        audiobook: 'https://example.com/great-gatsby-audiobook'
      },
      reviews: [
        { author: 'BookLover123', rating: 5, text: 'A timeless masterpiece!' }
      ],
      faqs: [
        { question: 'What is the main theme?', answer: 'The American Dream and its corruption.' }
      ]
    },
    {
      title: 'To Kill a Mockingbird',
      slug: 'kill-mockingbird',
      author_slug: 'harper-lee',
      description: 'A classic novel about racial injustice and childhood in the American South.',
      cover_image: 'https://picsum.photos/400/600?random=2',
      category_name: 'Fiction',
      featured: false,
      quotes: ['You never really understand a person until you consider things from his point of view.'],
      purchase_urls: {
        paperback: 'https://example.com/mockingbird-paperback',
        ebook: 'https://example.com/mockingbird-ebook'
      },
      reviews: [
        { author: 'Reader456', rating: 5, text: 'Essential reading for everyone.' }
      ],
      faqs: [
        { question: 'Is this based on a true story?', answer: 'It\'s inspired by real events but fictionalized.' }
      ]
    },
    {
      title: 'Steve Jobs Biography',
      slug: 'steve-jobs-biography',
      author_slug: 'walter-isaacson',
      description: 'The definitive biography of Apple cofounder Steve Jobs.',
      cover_image: 'https://picsum.photos/400/600?random=3',
      category_name: 'Biography',
      featured: true,
      quotes: ['Innovation distinguishes between a leader and a follower.'],
      reviews: [
        { author: 'TechEnthusiast', rating: 5, text: 'Captivating story of innovation.' }
      ]
    }
  ];

  try {
    for (const book of books) {
      // Get category ID by name
      const categoryRes = await pool.query('SELECT id FROM categories WHERE name = $1', [book.category_name]);
      if (categoryRes.rows.length === 0) {
        console.log(`⚠️  Skipping book ${book.title} - category "${book.category_name}" not found`);
        continue;
      }
      const categoryId = categoryRes.rows[0].id;

      await pool.query(`
        INSERT INTO books (
          title, slug, description, cover_image, category_id, featured,
          quotes, purchase_urls, reviews, faqs
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (slug) DO NOTHING
      `, [
        book.title,
        book.slug,
        book.description,
        book.cover_image,
        categoryId,
        book.featured,
        JSON.stringify(book.quotes),
        JSON.stringify(book.purchase_urls),
        JSON.stringify(book.reviews),
        JSON.stringify(book.faqs)
      ]);

      // Add author relationship
      const authorRes = await pool.query('SELECT id FROM authors WHERE slug = $1', [book.author_slug]);
      if (authorRes.rows.length > 0) {
        await pool.query(`
          INSERT INTO book_authors (book_id, author_id)
          SELECT b.id, $2 FROM books b WHERE b.slug = $1
          ON CONFLICT DO NOTHING
        `, [book.slug, authorRes.rows[0].id]);
      }

      console.log(`✅ Inserted book: ${book.title}`);
    }

    console.log('🎉 Books seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedBooks();

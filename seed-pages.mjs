import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function seedPages() {
  try {
    await client.connect();

    console.log('Creating pages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages (
        slug VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        structured_content JSONB
      );
    `);

    console.log('Inserting page data...');
    const pages = [
      {
        slug: 'about',
        title: 'About Us',
        content: `<p>Welcome to libribooks.com, your friendly corner of the internet for discovering amazing books and sharing the love of reading.</p><p>We are passionate about books and believe that everyone should have access to great literature. Our team of book lovers works tirelessly to provide honest reviews, insightful analysis, and a community where readers can connect.</p>`,
        structured_content: {
          tagline: "Your friendly corner of the internet for discovering amazing books",
          imageUrl: "/uploads/about.jpg"
        }
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        content: `<p>We'd love to hear from you! Whether you have a question about our reviews, want to suggest a book, or just want to say hello, please don't hesitate to get in touch.</p>`,
        structured_content: {
          contactEmail: "contact@libribooks.com",
          contactPhone: "+1 (555) 123-4567",
          officeAddress: "123 Book Street, Reading City, RC 12345"
        }
      },
      {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        content: `<p>Here are some of the most common questions we receive about libribooks.com.</p>`,
        structured_content: {
          items: [
            {
              question: "How do I submit a book review?",
              answer: "You can submit your book review through our contact form or by emailing us directly."
            },
            {
              question: "Can I suggest a book for review?",
              answer: "Absolutely! We love hearing suggestions from our community."
            }
          ]
        }
      },
      {
        slug: 'terms',
        title: 'Terms of Service',
        content: `<p>Please read these Terms of Service carefully before using libribooks.com.</p><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><ul><li>You agree to use the site only for lawful purposes.</li><li>You agree not to post any content that is illegal, harmful, or offensive.</li><li>All content on this site is protected by copyright.</li></ul>`,
        structured_content: null
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `<p>This Privacy Policy describes how we collect, use, and protect your personal information when you visit libribooks.com.</p><p>We collect information you provide directly to us, such as when you contact us or subscribe to our newsletter. We also collect certain information automatically, such as your IP address and browsing behavior.</p><p>We use this information to provide our services, communicate with you, and improve our site. We do not sell or share your personal information with third parties without your consent.</p>`,
        structured_content: null
      },
      {
        slug: 'cookie-policy',
        title: 'Cookie Policy',
        content: `<p>This Cookie Policy explains how libribooks.com uses cookies and similar technologies.</p><p>Cookies are small text files that are stored on your device when you visit our site. We use cookies to improve your browsing experience, analyze site traffic, and remember your preferences.</p><p>You can control cookies through your browser settings, but disabling them may affect your experience on our site.</p>`,
        structured_content: null
      }
    ];

    for (const page of pages) {
      await client.query(
        'INSERT INTO pages (slug, title, content, structured_content) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING',
        [page.slug, page.title, page.content, JSON.stringify(page.structured_content)]
      );
      console.log(`Inserted/Updated page: ${page.slug}`);
    }

    console.log('Pages seeding completed!');
  } catch (error) {
    console.error('Error seeding pages:', error);
  } finally {
    await client.end();
  }
}

seedPages();

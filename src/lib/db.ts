import { Pool } from 'pg';
import dns from 'dns';

// Force IPV4 resolution for Supabase on Vercel
dns.setDefaultResultOrder('ipv4first');

let pool: Pool;

async function initializePool() {
  console.log('Initializing database pool...');
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
  console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE);
  console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);

  // Resolve hostname to IPv4 first to avoid Vercel IPv6 issues
  let host = process.env.POSTGRES_HOST;
  try {
    if (host && !host.includes('localhost') && !host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      const { address } = await dns.promises.lookup(host, { family: 4 });
      console.log(`Resolved ${host} to ${address}`);
      host = address;
    }
  } catch (e) {
    console.warn('Failed to resolve hostname to IPv4, using original host:', e);
  }

  // Create pool
  pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: host,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    ssl: process.env.POSTGRES_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  });

  // Ensure faqs and slug columns exist
  try {
    await pool.query(`ALTER TABLE books ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb`);
    await pool.query(`ALTER TABLE books ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE`);
    await pool.query(`ALTER TABLE authors ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE`);
    console.log('✓ Database schema initialized - added faqs and slug columns to books and authors tables');
  } catch (error: any) {
    console.warn('⚠ Failed to add faqs or slug columns to database:', error?.message || error);
    // Continue anyway, the columns might already exist
  }

  console.log('Database pool initialized.');
  return pool;
}

if (process.env.NODE_ENV === 'production') {
  pool = await initializePool();
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any).pool) {
    (global as any).pool = await initializePool();
  }
  pool = (global as any).pool;
}

export const db = pool;

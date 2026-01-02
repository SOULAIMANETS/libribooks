import { db } from './src/lib/db.js';

try {
  const result = await db.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name LIKE '%settings%'
  `);

  console.log('Settings tables:', result.rows.map(r => r.table_name));

  // Check if the new tables exist
  const tables = result.rows.map(r => r.table_name);
  const missingTables = ['appearance_settings', 'routing_settings', 'integrations_settings'];

  for (const table of missingTables) {
    if (!tables.includes(table)) {
      console.log(`Creating missing table: ${table}`);

      if (table === 'appearance_settings') {
        await db.query(`
          CREATE TABLE appearance_settings (
              id SERIAL PRIMARY KEY,
              enable_dark_mode BOOLEAN DEFAULT true,
              headline_font VARCHAR(255) DEFAULT 'space_grotesk',
              body_font VARCHAR(255) DEFAULT 'literata',
              color_primary VARCHAR(255) DEFAULT '201 41% 55%',
              color_background VARCHAR(255) DEFAULT '0 0% 100%',
              color_accent VARCHAR(255) DEFAULT '201 41% 55%',
              quick_links JSONB DEFAULT '[]'::jsonb,
              legal_links JSONB DEFAULT '[]'::jsonb
          )
        `);

        await db.query(`
          INSERT INTO appearance_settings (enable_dark_mode, headline_font, body_font, color_primary, color_background, color_accent, quick_links, legal_links)
          VALUES (true, 'space_grotesk', 'literata', '201 41% 55%', '0 0% 100%', '201 41% 55%', '[]'::jsonb, '[]'::jsonb)
        `);
      }

      if (table === 'routing_settings') {
        await db.query(`
          CREATE TABLE routing_settings (
              id SERIAL PRIMARY KEY,
              base_url VARCHAR(500) DEFAULT 'https://libribooks.com',
              permalink_structure VARCHAR(50) DEFAULT 'book',
              enable_canonical BOOLEAN DEFAULT true
          )
        `);

        await db.query(`
          INSERT INTO routing_settings (base_url, permalink_structure, enable_canonical)
          VALUES ('https://libribooks.com', 'book', true)
        `);
      }

      if (table === 'integrations_settings') {
        await db.query(`
          CREATE TABLE integrations_settings (
              id SERIAL PRIMARY KEY,
              google_analytics_id VARCHAR(255),
              facebook_pixel_id VARCHAR(255),
              custom_api_key VARCHAR(255)
          )
        `);

        await db.query(`
          INSERT INTO integrations_settings (google_analytics_id, facebook_pixel_id, custom_api_key)
          VALUES (NULL, NULL, NULL)
        `);
      }
    }
  }

  console.log('Settings tables setup completed successfully!');
} catch (error) {
  console.error('Error:', error);
}

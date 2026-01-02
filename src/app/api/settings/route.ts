import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Handler for GET requests to fetch site settings
export async function GET() {
  try {
    const result = await db.query('SELECT * FROM site_settings LIMIT 1');
    if (result.rows.length === 0) {
      // If no settings exist, return a default structure with frontend field names
      return NextResponse.json({
        siteName: 'libribooks.com',
        welcomeMessage: 'Welcome to LibriBooks!',
        welcomeText: 'Explore our vast collection of books and discover your next literary adventure.',
        aboutSite: 'LibriBooks is your friendly corner of the internet for discovering amazing books and sharing the love of reading.',
        socialMediaLinks: { twitter: '', facebook: '', youtube: '', linkedin: '' },
      });
    }
    // Map database field names to frontend field names
    const settings = result.rows[0];
    return NextResponse.json({
      siteName: settings.site_name || 'libribooks.com',
      welcomeMessage: settings.welcome_message || 'Welcome to LibriBooks!',
      welcomeText: settings.welcome_text || 'Explore our vast collection of books and discover your next literary adventure.',
      aboutSite: settings.about_site || 'LibriBooks is your friendly corner of the internet for discovering amazing books and sharing the love of reading.',
      socialMediaLinks: settings.social_media_links || { twitter: '', facebook: '', youtube: '', linkedin: '' },
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({
      message: 'Error fetching site settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handler for POST requests to update site settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      siteName,
      welcomeMessage,
      welcomeText,
      aboutSite,
      socialMediaLinks,
    } = body;

    // Map frontend field names to database field names
    const site_name = siteName;
    const welcome_message = welcomeMessage;
    const welcome_text = welcomeText;
    const about_site = aboutSite;
    const social_media_links = socialMediaLinks;

    // Validate input (basic validation)
    if (!siteName) {
      return NextResponse.json({ message: 'Site name is required' }, { status: 400 });
    }

    // Check if a settings row already exists. If so, update it. Otherwise, insert.
    const existingSettingsResult = await db.query('SELECT id FROM site_settings LIMIT 1');

    let query: string;
    let queryParams: any[];

    if (existingSettingsResult.rows.length > 0) {
      // Update existing row
      const settingsId = existingSettingsResult.rows[0].id;
      query = `
        UPDATE site_settings
        SET
          site_name = $1,
          welcome_message = $2,
          welcome_text = $3,
          about_site = $4,
          social_media_links = $5
        WHERE id = $6
        RETURNING *;
      `;
      queryParams = [
        site_name,
        welcome_message,
        welcome_text,
        about_site,
        JSON.stringify(social_media_links), // Ensure social_media_links is stringified for JSONB
        settingsId,
      ];
    } else {
      // Insert new row if none exists
      query = `
        INSERT INTO site_settings (site_name, welcome_message, welcome_text, about_site, social_media_links)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      queryParams = [
        site_name,
        welcome_message,
        welcome_text,
        about_site,
        JSON.stringify(social_media_links), // Ensure social_media_links is stringified for JSONB
      ];
    }

    const result = await db.query(query, queryParams);

    // Map database field names back to frontend field names for the response
    const savedSettings = result.rows[0];
    return NextResponse.json({
      siteName: savedSettings.site_name,
      welcomeMessage: savedSettings.welcome_message,
      welcomeText: savedSettings.welcome_text,
      aboutSite: savedSettings.about_site,
      socialMediaLinks: savedSettings.social_media_links,
    });

  } catch (error: any) {
    console.error('Error saving site settings:', error);
    // Provide a more specific error message if available from the database error
    const errorMessage = error.message || 'Error saving site settings';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

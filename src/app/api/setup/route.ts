import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Adding faqs column to books table...');

    // Try to add the faqs column with JSONB type for arrays
    await db.query(`ALTER TABLE books ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb`);

    console.log('Successfully added faqs column to books table.');

    // Verify the column was added
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'books' AND column_name = 'faqs'
    `);

    if (result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'faqs column successfully added to books table',
        column: result.rows[0]
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Column not found after adding it!'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error adding column:', error);

    // If the error is about column already existing, that's fine
    if (error.message && error.message.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'faqs column already exists'
      });
    }

    return NextResponse.json({
      success: false,
      message: `Error adding column: ${error.message}`
    }, { status: 500 });
  }
}

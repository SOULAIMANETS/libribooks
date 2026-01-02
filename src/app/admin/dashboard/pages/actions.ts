'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Page } from '@/lib/types';

export async function addPage(pageData: Omit<Page, 'slug'>) {
  const { title, content, structured_content } = pageData;
  if (!title) {
    return { success: false, message: 'Page title is required.' };
  }

  const slug = title.toLowerCase().replace(/\s+/g, '-');

  try {
    await db.query(
      'INSERT INTO pages (title, slug, content, structured_content) VALUES ($1, $2, $3, $4)',
      [title, slug, content, JSON.stringify(structured_content || {})]
    );
    revalidatePath('/admin/dashboard/pages');
    return { success: true, message: 'Page added successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add page: ${errorMessage}` };
  }
}

export async function updatePage(pageData: Page) {
  const { slug, title, content, structured_content } = pageData;
  if (!title) {
    return { success: false, message: 'Page title is required.' };
  }

  const newSlug = title.toLowerCase().replace(/\s+/g, '-');

  try {
    await db.query(
      'UPDATE pages SET title = $1, slug = $2, content = $3, structured_content = $4 WHERE slug = $5',
      [title, newSlug, content, JSON.stringify(structured_content || {}), slug]
    );
    revalidatePath('/admin/dashboard/pages');
    revalidatePath(`/${slug}`);
    return { success: true, message: 'Page updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update page: ${errorMessage}` };
  }
}

export async function deletePage(slug: string) {
  try {
    const result = await db.query('DELETE FROM pages WHERE slug = $1', [slug]);
    
    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/pages');
      return { success: true, message: 'Page deleted successfully.' };
    } else {
      throw new Error('Page not found or already deleted.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete page: ${errorMessage}` };
  }
}

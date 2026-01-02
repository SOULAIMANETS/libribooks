import { db } from '@/lib/db';
import { Page } from '@/lib/types';

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await db.query('SELECT * FROM pages WHERE slug = $1', [slug]);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as Page;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    const res = await db.query('SELECT * FROM pages');
    return res.rows as Page[];
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}

export async function createPage(page: Omit<Page, 'id'>): Promise<Page | null> {
  const { slug, title, content, structured_content } = page;
  try {
    const res = await db.query(
      'INSERT INTO pages (slug, title, content, structured_content) VALUES ($1, $2, $3, $4) RETURNING *',
      [slug, title, content, structured_content]
    );
    return res.rows[0] as Page;
  } catch (error) {
    console.error('Error creating page:', error);
    return null;
  }
}

export async function updatePage(slug: string, page: Partial<Omit<Page, 'id'>>): Promise<Page | null> {
  const { title, content, structured_content } = page;
  try {
    const res = await db.query(
      'UPDATE pages SET title = $1, content = $2, structured_content = $3 WHERE slug = $4 RETURNING *',
      [title, content, structured_content, slug]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0] as Page;
  } catch (error) {
    console.error('Error updating page:', error);
    return null;
  }
}

export async function deletePage(slug: string): Promise<boolean> {
  try {
    const res = await db.query('DELETE FROM pages WHERE slug = $1', [slug]);
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting page:', error);
    return false;
  }
}

export {};

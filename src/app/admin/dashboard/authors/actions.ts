'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Author } from '@/lib/types';
import { generateUniqueSlug } from '@/lib/data';

export async function addAuthor(authorData: Omit<Author, 'id'>) {
  const { name, bio, image, slug } = authorData;
  if (!name) {
    return { success: false, message: 'Author name is required.' };
  }

  const generatedSlug = await generateUniqueSlug(name, 'author', 'authors');

  try {
    await db.query(
      'INSERT INTO authors (name, bio, image, slug) VALUES ($1, $2, $3, $4)',
      [name, bio, image || `https://picsum.photos/400/400?random=${Date.now()}`, generatedSlug]
    );
    revalidatePath('/admin/dashboard/authors');
    return { success: true, message: 'Author added successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add author: ${errorMessage}` };
  }
}

export async function updateAuthor(authorData: Author) {
  const { id, name, bio, image, slug: oldSlug } = authorData;
  if (!name) {
    return { success: false, message: 'Author name is required.' };
  }

  const newSlug = await generateUniqueSlug(name, 'author', 'authors');

  try {
    await db.query(
      'UPDATE authors SET name = $1, bio = $2, image = $3, slug = $4 WHERE id = $5',
      [name, bio, image, newSlug, id]
    );
    revalidatePath('/admin/dashboard/authors');
    revalidatePath(`/author/${oldSlug}`);
    revalidatePath(`/author/${newSlug}`);
    return { success: true, message: 'Author updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update author: ${errorMessage}` };
  }
}

export async function deleteAuthor(authorId: number) {
  try {
    await db.query('BEGIN');

    // Set author_id to NULL for articles by this author
    await db.query('UPDATE articles SET author_id = NULL WHERE author_id = $1', [authorId]);

    // Delete associations from the book_authors table
    await db.query('DELETE FROM book_authors WHERE author_id = $1', [authorId]);

    // Finally, delete the author
    const result = await db.query('DELETE FROM authors WHERE id = $1', [authorId]);
    
    await db.query('COMMIT');

    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/authors');
      return { success: true, message: 'Author deleted successfully.' };
    } else {
      // This case could mean the author was already deleted.
      // We still revalidate because related data might have been cleaned up.
      revalidatePath('/admin/dashboard/authors');
      return { success: true, message: 'Author not found, but related data cleaned up.' };
    }
  } catch (error) {
    await db.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete author: ${errorMessage}` };
  }
}

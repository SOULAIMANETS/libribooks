'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Tag } from '@/lib/types';

export async function addTag(tag: Omit<Tag, 'id'>) {
  const { name, category_id } = tag;
  if (!name) {
    return { success: false, message: 'Tag name is required.' };
  }
  if (!category_id) {
    return { success: false, message: 'Category is required.' };
  }

  try {
    await db.query('INSERT INTO tags (name, category_id) VALUES ($1, $2)', [name, category_id]);
    revalidatePath('/admin/dashboard/tags');
    return { success: true, message: 'Tag added successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add tag: ${errorMessage}` };
  }
}

export async function updateTag(tag: Tag) {
  const { id, name, category_id } = tag;
  if (!name) {
    return { success: false, message: 'Tag name is required.' };
  }
  if (!category_id) {
    return { success: false, message: 'Category is required.' };
  }

  try {
    await db.query('UPDATE tags SET name = $1, category_id = $2 WHERE id = $3', [name, category_id, id]);
    revalidatePath('/admin/dashboard/tags');
    return { success: true, message: 'Tag updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update tag: ${errorMessage}` };
  }
}

export async function deleteTag(tagId: number) {
  try {
    // Before deleting the tag, we need to remove its associations from the book_tags table.
    await db.query('DELETE FROM book_tags WHERE tag_id = $1', [tagId]);
    
    const result = await db.query('DELETE FROM tags WHERE id = $1', [tagId]);
    
    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/tags');
      return { success: true, message: 'Tag deleted successfully.' };
    } else {
      throw new Error('Tag not found or already deleted.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete tag: ${errorMessage}` };
  }
}

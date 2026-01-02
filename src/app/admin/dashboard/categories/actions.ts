'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Category } from '@/lib/types';

export async function addCategory(name: string) {
  if (!name) {
    return { success: false, message: 'Category name is required.' };
  }

  try {
    await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    revalidatePath('/admin/dashboard/categories');
    return { success: true, message: 'Category added successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add category: ${errorMessage}` };
  }
}

export async function updateCategory(category: Category) {
  const { id, name } = category;
  if (!name) {
    return { success: false, message: 'Category name is required.' };
  }

  try {
    await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
    revalidatePath('/admin/dashboard/categories');
    return { success: true, message: 'Category updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to update category: ${errorMessage}` };
  }
}

export async function deleteCategory(categoryId: number) {
  try {
    // Start a transaction
    await db.query('BEGIN');

    // Set category_id to NULL for all books associated with this category
    await db.query('UPDATE books SET category_id = NULL WHERE category_id = $1', [categoryId]);

    // Delete the category
    const result = await db.query('DELETE FROM categories WHERE id = $1', [categoryId]);

    // Commit the transaction
    await db.query('COMMIT');
    
    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/categories');
      return { success: true, message: 'Category deleted successfully.' };
    } else {
      throw new Error('Category not found or already deleted.');
    }
  } catch (error) {
    // Rollback in case of error
    await db.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete category: ${errorMessage}` };
  }
}

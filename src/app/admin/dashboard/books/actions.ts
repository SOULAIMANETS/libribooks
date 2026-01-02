'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateUniqueSlug } from '@/lib/data';

export async function deleteBook(bookId: number) {
  try {
    // Start a transaction
    await db.query('BEGIN');

    // Delete from junction tables first
    await db.query('DELETE FROM book_authors WHERE book_id = $1', [bookId]);
    await db.query('DELETE FROM book_tags WHERE book_id = $1', [bookId]);

    // Delete the book itself
    const result = await db.query('DELETE FROM books WHERE id = $1', [bookId]);

    // Commit the transaction
    await db.query('COMMIT');

    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/books');
      revalidatePath('/');
      revalidatePath(`/book/${bookId}`);
      return { success: true, message: 'Book deleted successfully.' };
    } else {
      throw new Error('Book not found or already deleted.');
    }
  } catch (error) {
    // Rollback in case of error
    await db.query('ROLLBACK');
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete book: ${errorMessage}` };
  }
}

import { Book } from '@/lib/types';

export async function addBook(bookData: any) {
  // Basic validation
  if (!bookData.title || !bookData.authors) {
    return { success: false, message: 'Title and authors are required.' };
  }
  if (!bookData.category) {
    return { success: false, message: 'Category is required.' };
  }

  try {
    await db.query('BEGIN');

    // Handle category
    let categoryId;
    const catRes = await db.query('SELECT id FROM categories WHERE name = $1', [bookData.category]);
    if (catRes.rows.length > 0) {
      categoryId = catRes.rows[0].id;
    } else {
      // Ensure category name is not empty before inserting
      if (!bookData.category.trim()) {
        throw new Error('Category name cannot be empty.');
      }
      const newCatRes = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [bookData.category]);
      categoryId = newCatRes.rows[0].id;
    }

    // Generate slug for the book
    const bookSlug = await generateUniqueSlug(bookData.title, 'book', 'books');

    // Insert book
    const bookRes = await db.query(
      'INSERT INTO books (title, description, cover_image, category_id, featured, reviews, quotes, purchase_urls, faqs, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [bookData.title, bookData.description, bookData.coverImage, categoryId, bookData.featured || false, JSON.stringify(bookData.reviews || []), JSON.stringify(bookData.quotes || []), JSON.stringify(bookData.purchaseUrls || {}), JSON.stringify(bookData.faqs || []), bookSlug]
    );
    const newBookId = bookRes.rows[0].id;

    // Handle authors
    const authorNames = Array.isArray(bookData.authors) ? bookData.authors : bookData.authors.split(',').map((s: string) => s.trim()).filter(Boolean);
    for (const name of authorNames) {
      let authorId;
      const authorRes = await db.query('SELECT id FROM authors WHERE name = $1', [name]);
      if (authorRes.rows.length > 0) {
        authorId = authorRes.rows[0].id;
      } else {
        const newAuthorRes = await db.query('INSERT INTO authors (name, bio, image) VALUES ($1, $2, $3) RETURNING id', [name, '', `https://picsum.photos/400/400?random=${Date.now()}`]);
        authorId = newAuthorRes.rows[0].id;
      }
      await db.query('INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)', [newBookId, authorId]);
    }

    // Handle tags
    const tagNames = Array.isArray(bookData.tags) ? bookData.tags : (typeof bookData.tags === 'string' ? bookData.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
    for (const name of tagNames) {
      let tagId;
      const tagRes = await db.query('SELECT id FROM tags WHERE name = $1', [name]);
      if (tagRes.rows.length > 0) {
        tagId = tagRes.rows[0].id;
      } else {
        const newTagRes = await db.query('INSERT INTO tags (name, category_id) VALUES ($1, $2) RETURNING id', [name, categoryId]);
        tagId = newTagRes.rows[0].id;
      }
      await db.query('INSERT INTO book_tags (book_id, tag_id) VALUES ($1, $2)', [newBookId, tagId]);
    }

    await db.query('COMMIT');
    revalidatePath('/admin/dashboard/books');
    revalidatePath('/');
    revalidatePath(`/book/${newBookId}`);
    return { success: true, message: 'Book added successfully.' };

  } catch (error) {
    await db.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add book: ${errorMessage}` };
  }
}

export async function updateBook(bookData: any) {
    try {
        await db.query('BEGIN');

        // Update category
        let categoryId;
        if (bookData.category) {
            const catRes = await db.query('SELECT id FROM categories WHERE name = $1', [bookData.category]);
            if (catRes.rows.length > 0) {
                categoryId = catRes.rows[0].id;
            } else {
                 // Ensure category name is not empty before inserting
                if (!bookData.category.trim()) {
                    throw new Error('Category name cannot be empty.');
                }
                const newCatRes = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [bookData.category]);
                categoryId = newCatRes.rows[0].id;
            }
        }

        // Update book details
        await db.query(
            'UPDATE books SET title = $1, description = $2, cover_image = $3, category_id = $4, featured = $5, reviews = $6, quotes = $7, purchase_urls = $8, faqs = $9 WHERE id = $10',
            [bookData.title, bookData.description, bookData.coverImage, categoryId, bookData.featured, JSON.stringify(bookData.reviews || []), JSON.stringify(bookData.quotes || []), JSON.stringify(bookData.purchaseUrls || {}), JSON.stringify(bookData.faqs || []), bookData.id]
        );

        // Clear existing author and tag relations
        await db.query('DELETE FROM book_authors WHERE book_id = $1', [bookData.id]);
        await db.query('DELETE FROM book_tags WHERE book_id = $1', [bookData.id]);

        // Re-add authors and tags (similar to addBook)
        const authorNames = Array.isArray(bookData.authors) ? bookData.authors : (bookData.authors || '').split(',').map((s: string) => s.trim()).filter(Boolean);
        for (const name of authorNames) {
            let authorId;
            const authorRes = await db.query('SELECT id FROM authors WHERE name = $1', [name]);
            if (authorRes.rows.length > 0) {
                authorId = authorRes.rows[0].id;
            } else {
                const newAuthorRes = await db.query('INSERT INTO authors (name, bio, image) VALUES ($1, $2, $3) RETURNING id', [name, '', `https://picsum.photos/400/400?random=${Date.now()}`]);
                authorId = newAuthorRes.rows[0].id;
            }
            await db.query('INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)', [bookData.id, authorId]);
        }

        const tagNames = Array.isArray(bookData.tags) ? bookData.tags : (typeof bookData.tags === 'string' ? bookData.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
        for (const name of tagNames) {
            let tagId;
            const tagRes = await db.query('SELECT id FROM tags WHERE name = $1', [name]);
            if (tagRes.rows.length > 0) {
                tagId = tagRes.rows[0].id;
            } else {
                const newTagRes = await db.query('INSERT INTO tags (name, category_id) VALUES ($1, $2) RETURNING id', [name, categoryId]);
                tagId = newTagRes.rows[0].id;
            }
            await db.query('INSERT INTO book_tags (book_id, tag_id) VALUES ($1, $2)', [bookData.id, tagId]);
        }

        await db.query('COMMIT');
        revalidatePath('/admin/dashboard/books');
        revalidatePath('/');
        revalidatePath(`/book/${bookData.id}`);
        return { success: true, message: 'Book updated successfully.' };

    } catch (error) {
        await db.query('ROLLBACK');
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update book: ${errorMessage}` };
    }
}

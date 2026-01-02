import { BookForm } from '@/components/admin/BookForm';
import { db } from '@/lib/db';
import { addBook } from '../actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Tag } from '@/lib/types';

async function getAuthorsCategoriesAndTags() {
  const authorsRes = await db.query('SELECT id, name FROM authors ORDER BY name');
  const categoriesRes = await db.query('SELECT id, name FROM categories ORDER BY name');
  const tagsRes = await db.query('SELECT id, name, category_id FROM tags ORDER BY name');
  return {
    authors: authorsRes.rows,
    categories: categoriesRes.rows,
    tags: tagsRes.rows,
  };
}

export default async function NewBookPage() {
  const { authors, categories, tags } = await getAuthorsCategoriesAndTags();

  const handleSubmit = async (data: any) => {
    'use server';
    const result = await addBook(data);
    if (result.success) {
      revalidatePath('/admin/dashboard/books');
      redirect('/admin/dashboard/books');
    } else {
      console.error('Failed to add book:', result.message);
      // In a real application, you'd handle this error more gracefully,
      // perhaps by passing it back to the client to display a toast.
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
      <BookForm authors={authors} categories={categories} tags={tags} onSubmit={handleSubmit} />
    </div>
  );
}

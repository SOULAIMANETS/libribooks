
import { db } from '@/lib/db';
import { CategoriesClient } from './categories-client';
import type { Category } from '@/lib/types';

const BATCH_SIZE = 10;

async function getCategories(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const res = await db.query('SELECT * FROM categories ORDER BY name ASC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM categories');
  const total = parseInt(countRes.rows[0].count, 10);
  return {
    categories: res.rows as Category[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function CategoriesDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { categories, totalPages } = await getCategories(page);
  return <CategoriesClient categories={categories} totalPages={totalPages} />;
}

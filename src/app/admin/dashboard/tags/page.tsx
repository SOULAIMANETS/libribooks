
import { db } from '@/lib/db';
import { TagsClient } from './tags-client';
import type { Tag, Category } from '@/lib/types';

const BATCH_SIZE = 10;

async function getData(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  
  const tagsRes = await db.query('SELECT * FROM tags ORDER BY name ASC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM tags');
  const total = parseInt(countRes.rows[0].count, 10);
  
  const categoriesRes = await db.query('SELECT * FROM categories ORDER BY name ASC');

  return {
    tags: tagsRes.rows as Tag[],
    categories: categoriesRes.rows as Category[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function TagsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { tags, categories, totalPages } = await getData(page);
  return <TagsClient tags={tags} categories={categories} totalPages={totalPages} />;
}

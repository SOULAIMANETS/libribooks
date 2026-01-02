
import { db } from '@/lib/db';
import { PagesClient } from './pages-client';
import type { Page } from '@/lib/types';

const BATCH_SIZE = 10;

async function getPages(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const res = await db.query('SELECT * FROM pages ORDER BY title ASC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM pages');
  const total = parseInt(countRes.rows[0].count, 10);
  return {
    pages: res.rows as Page[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function PagesDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { pages, totalPages } = await getPages(page);
  return <PagesClient pages={pages} totalPages={totalPages} />;
}

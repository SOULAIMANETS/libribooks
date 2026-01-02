import { db } from '@/lib/db';
import { AuthorsClient } from './authors-client.tsx';
import type { Author } from '@/lib/types';

const BATCH_SIZE = 10;

async function getAuthors(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const res = await db.query('SELECT * FROM authors ORDER BY name ASC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM authors');
  const total = parseInt(countRes.rows[0].count, 10);
  return {
    authors: res.rows as Author[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function AuthorsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { authors, totalPages } = await getAuthors(page);
  return <AuthorsClient authors={authors} totalPages={totalPages} />;
}

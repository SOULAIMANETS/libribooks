
import { db } from '@/lib/db';
import { PopupsClient } from './popups-client';
import type { PopupAd } from '@/lib/types';

const BATCH_SIZE = 10;

async function getPopups(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const res = await db.query('SELECT * FROM popups ORDER BY id DESC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM popups');
  const total = parseInt(countRes.rows[0].count, 10);
  return {
    popups: res.rows as PopupAd[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function PopupsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { popups, totalPages } = await getPopups(page);
  return <PopupsClient popups={popups} totalPages={totalPages} />;
}


import { db } from '@/lib/db';
import { UsersClient } from './users-client';
import type { User } from '@/lib/types';

const BATCH_SIZE = 10;

async function getUsers(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  const res = await db.query('SELECT * FROM users ORDER BY username ASC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const countRes = await db.query('SELECT COUNT(*) FROM users');
  const total = parseInt(countRes.rows[0].count, 10);
  return {
    users: res.rows as User[],
    totalPages: Math.ceil(total / BATCH_SIZE),
  };
}

export default async function UsersDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { users, totalPages } = await getUsers(page);
  return <UsersClient users={users} totalPages={totalPages} />;
}

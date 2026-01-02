
import { db } from '@/lib/db';
import { ArticlesClient } from './articles-client';
import type { Article, Author } from '@/lib/types';

const BATCH_SIZE = 10;

async function getData(page: number = 1) {
  const offset = (page - 1) * BATCH_SIZE;
  
  const articlesRes = await db.query('SELECT * FROM articles ORDER BY published_date DESC LIMIT $1 OFFSET $2', [BATCH_SIZE, offset]);
  const articlesCountRes = await db.query('SELECT COUNT(*) FROM articles');
  const totalArticles = parseInt(articlesCountRes.rows[0].count, 10);

  const authorsRes = await db.query('SELECT * FROM authors');
  
  return {
    articles: articlesRes.rows as Article[],
    authors: authorsRes.rows as Author[],
    totalPages: Math.ceil(totalArticles / BATCH_SIZE),
  };
}

export default async function ArticlesDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page as string, 10) : 1;
  const { articles, authors, totalPages } = await getData(page);
  return <ArticlesClient articles={articles} authors={authors} totalPages={totalPages} />;
}

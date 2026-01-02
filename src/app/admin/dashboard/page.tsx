import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookCopy, Users, FileText, Bookmark } from 'lucide-react';
import { BookCoverCard } from '@/components/BookCoverCard';
import { db } from '@/lib/db';
import type { Book } from '@/lib/types';
import ChartContainer from './chart-container';

async function getDashboardData() {
  const totalBooksRes = await db.query('SELECT COUNT(*) FROM books');
  const totalAuthorsRes = await db.query('SELECT COUNT(*) FROM authors');
  const totalArticlesRes = await db.query('SELECT COUNT(*) FROM articles');
  const totalCategoriesRes = await db.query('SELECT COUNT(*) FROM categories');

  const booksByCategoryQuery = `
    SELECT c.name as category, COUNT(b.id) as count
    FROM books b
    JOIN categories c ON b.category_id = c.id
    GROUP BY c.name
  `;
  const booksByCategoryRes = await db.query(booksByCategoryQuery);

  const recentBooksQuery = `
    SELECT
      b.id, b.title, b.description, b.cover_image as "coverImage", b.featured, b.reviews, b.quotes, b.purchase_urls as "purchase_urls",
      c.name as category,
      array_agg(DISTINCT a.name) as authors,
      array_agg(DISTINCT a.id) as "authorIds"
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    GROUP BY b.id, c.name
    ORDER BY b.id DESC
    LIMIT 5
  `;
  const recentBooksRes = await db.query(recentBooksQuery);

  const recentBooks: Book[] = recentBooksRes.rows.map((book: any) => ({
    ...book,
    slug: book.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    tags: [],
    reviews: book.reviews || [],
    quotes: book.quotes || []
  }));

  return {
    totalBooks: totalBooksRes.rows[0].count,
    totalAuthors: totalAuthorsRes.rows[0].count,
    totalArticles: totalArticlesRes.rows[0].count,
    totalCategories: totalCategoriesRes.rows[0].count,
    booksByCategory: booksByCategoryRes.rows,
    recentBooks,
  };
}

export default async function DashboardPage() {
  const {
    totalBooks,
    totalAuthors,
    totalArticles,
    totalCategories,
    booksByCategory,
    recentBooks,
  } = await getDashboardData();

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuthors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
              <CardTitle>Recently Added Books</CardTitle>
              <CardDescription>
                The latest additions to your library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {recentBooks.map((book) => (
                    <div key={book.id}>
                        <div className="relative aspect-[2/3] w-full">
                           <BookCoverCard book={book} />
                        </div>
                        <p className="text-xs font-medium truncate mt-1 text-center">{book.title}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        <ChartContainer data={booksByCategory} />
      </div>


    </div>
  );
}

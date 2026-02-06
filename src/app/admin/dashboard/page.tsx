'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BookCopy, Users, FileText, Bookmark, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { BookCoverCard } from '@/components/BookCoverCard';
import { bookService, authorService, articleService, categoryService } from '@/lib/services';
import type { Book, Author, Article, Category } from '@/lib/types';

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, authorsData, articlesData, categoriesData] = await Promise.all([
          bookService.getAll(),
          authorService.getAll(),
          articleService.getAll({ includeScheduled: true }),
          categoryService.getAll(),
        ]);
        setBooks(booksData);
        setAuthors(authorsData);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBooks = books.length;
  const totalAuthors = authors.length;
  const totalArticles = articles.length;
  const totalCategories = categories.length;

  const booksByCategory = useMemo(() => {
    const categoryCounts = books.reduce((acc, book) => {
      // Handle cases where generic category might be null or undefined
      const catName = book.category || 'Uncategorized';
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  }, [books]);

  const recentBooks = useMemo(() => {
    // Assuming the API returns them sorted or we just take the first 5
    // If exact date sorting is needed, ensures books has a date field
    return books.slice(0, 5);
  }, [books]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

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
        <Card>
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
            <CardDescription>
              A breakdown of the books in your library by category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: 'Count',
                  color: 'hsl(var(--primary))',
                },
              }}
              className="min-h-[200px] w-full"
            >
              <BarChart
                data={booksByCategory}
                margin={{
                  top: 5,
                  right: 20,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

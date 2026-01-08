
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { articleService } from '@/lib/services';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Explore our collection of articles on literature, reading habits, and the world of books.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlesPage() {
  const articles = await articleService.getAll();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            Our Articles
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Thoughts on literature, reading habits, and the world of books.
          </p>
        </div>

        <div className="grid gap-12">
          {articles.map((article) => (
            <Card key={article.slug} className="flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/3">
                <div className="relative aspect-video w-full">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    data-ai-hint="article cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">
                    <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span>By {article.author}</span> &middot; <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/articles/${article.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

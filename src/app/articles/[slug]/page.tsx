
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';
import type { Article } from '@/lib/types';


export async function generateStaticParams() {
  const res = await db.query('SELECT slug FROM articles');
  return res.rows.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const query = `
      SELECT a.title, a.image as "coverImage", a.published_date as date, au.name as author, SUBSTRING(a.content, 1, 160) as excerpt
      FROM articles a
      JOIN authors au ON a.author_id = au.id
      WHERE a.slug = $1
    `;
    const res = await db.query(query, [resolvedParams.slug]);
    const article = res.rows[0];

    if (!article) {
        return {};
    }

    const pageUrl = `/articles/${resolvedParams.slug}`;
    const imageUrl = article.coverImage;

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: pageUrl,
            type: 'article',
            publishedTime: article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
            authors: [article.author],
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 400,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [imageUrl],
        },
    };
}

async function getArticle(slug: string) {
  console.log('Querying for article with slug:', slug);
  // Fetch article basic info first
  const articleQuery = `
    SELECT id, title, content, image, published_date, author_id, slug
    FROM articles
    WHERE slug = $1
  `;
  const articleRes = await db.query(articleQuery, [slug]);
  const article = articleRes.rows[0];

  if (!article) {
    console.log('Article not found in database.');
    return null; // Return null if article not found
  }

  console.log('Article found:', article);

  // Fetch author details
  const authorQuery = `
    SELECT name
    FROM authors
    WHERE id = $1
  `;
  const authorRes = await db.query(authorQuery, [article.author_id]);
  const author = authorRes.rows[0];

  if (!author) {
    console.log('Author not found for article.');
    // Handle case where author might not be found, though unlikely with FK
    return { ...article, author: 'Unknown Author' };
  }

  console.log('Author found:', author);

  // Combine article and author data
  const combinedArticle = {
    ...article,
    author: author.name,
    // Add excerpt for metadata generation if needed, though not strictly required for display
    excerpt: article.content ? article.content.substring(0, 160) : '',
  };

  console.log('Combined article data:', combinedArticle);
  return combinedArticle;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
       <JsonLd<SchemaArticle>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          author: {
            '@type': 'Person',
            name: article.author,
          },
          image: article.coverImage || '',
          datePublished: article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
          description: article.excerpt,
        }}
      />
      <main className="flex-1 w-full py-12">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video w-full mb-8">
             <Image
                src={article.image || '/placeholder.png'}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 896px"
                data-ai-hint="article hero"
                priority
              />
          </div>

          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{article.title}</h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.published_date), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <Separator className="mb-8" />

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-ol:list-decimal prose-ul:list-disc"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </article>
      </main>
    </>
  );
}

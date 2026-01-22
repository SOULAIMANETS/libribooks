
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { articleService } from '@/lib/services';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';
import type { Article } from '@/lib/types';


export async function generateStaticParams() {
  const articles = await articleService.getAll();
  return articles
    .filter((article) => article.slug)
    .map((article) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleService.getBySlug(slug);

  if (!article) {
    return {};
  }

  const pageUrl = `/articles/${article.slug}`;
  const imageUrl = article.coverImage;

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: pageUrl,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await articleService.getBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd<SchemaArticle>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          author: {
            '@type': 'Person',
            name: article.author,
          },
          image: article.coverImage,
          datePublished: new Date(article.date).toISOString(),
          description: article.excerpt,
        }}
      />
      <Header />
      <main className="flex-1 w-full py-12">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video w-full mb-8">
            <Image
              src={article.coverImage}
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
              <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <Separator className="mb-8" />

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-ol:list-decimal prose-ul:list-disc"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}

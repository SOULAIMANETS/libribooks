

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import pagesData from '@/lib/pages.json';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = pagesData.find(p => p.slug === 'cookie-policy');
  return {
    title: pageData?.title || 'Cookie Policy',
    description: 'Learn about how libribooks.com uses cookies to improve your browsing experience.',
  };
}

export default function CookiePolicyPage() {
  const pageData = pagesData.find(p => p.slug === 'cookie-policy');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div 
          className="prose dark:prose-invert max-w-none prose-headings:font-headline"
          dangerouslySetInnerHTML={{ __html: `<h1>${pageData.title}</h1>${pageData.content}`}}
        />
      </main>
      <Footer />
    </div>
  );
}

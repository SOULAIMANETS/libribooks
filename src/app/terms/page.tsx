

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import pagesData from '@/lib/pages.json';
import { notFound } from 'next/navigation';


export async function generateMetadata(): Promise<Metadata> {
    const pageData = pagesData.find(p => p.slug === 'terms');
    return {
        title: pageData?.title || 'Terms of Service',
        description: 'Read the terms and conditions for using libribooks.com.',
    };
};


export default function TermsPage() {
  const pageData = pagesData.find(p => p.slug === 'terms');

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

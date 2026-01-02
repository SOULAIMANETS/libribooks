

import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';


export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getPageBySlug('terms');
    return {
        title: pageData?.title || 'Terms of Service',
        description: 'Read the terms and conditions for using libribooks.com.',
    };
};


export default async function TermsPage() {
  const pageData = await getPageBySlug('terms');

  if (!pageData) {
    notFound();
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div
        className="prose dark:prose-invert max-w-none prose-headings:font-headline"
        dangerouslySetInnerHTML={{ __html: `<h1>${pageData.title}</h1>${pageData.content}` }}
      />
    </main>
  );
}

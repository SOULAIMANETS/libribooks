

import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('cookie-policy');
  return {
    title: pageData?.title || 'Cookie Policy',
    description: 'Learn about how libribooks.com uses cookies to improve your browsing experience.',
  };
}

export default async function CookiePolicyPage() {
  const pageData = await getPageBySlug('cookie-policy');

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

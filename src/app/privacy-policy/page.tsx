

import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getPageBySlug('privacy-policy');
    return {
        title: pageData?.title || 'Privacy Policy',
        description: 'Read the privacy policy for libribooks.com to understand how we handle your data.',
    };
};


export default async function PrivacyPolicyPage() {
  const pageData = await getPageBySlug('privacy-policy');

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


import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { BookOpen, Users, Target } from 'lucide-react';
import { Metadata } from 'next';
import { pageService } from '@/lib/services';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about the mission and story behind libribooks.com, your friendly corner of the internet for discovering amazing books.',
};

export default async function AboutPage() {
  const pageData = await pageService.getBySlug('about');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
              {pageData.title}
            </h1>
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

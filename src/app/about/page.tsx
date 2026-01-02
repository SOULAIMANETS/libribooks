
import Image from 'next/image';
import { BookOpen, Users, Target } from 'lucide-react';
import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about the mission and story behind libribooks.com, your friendly corner of the internet for discovering amazing books.',
};

export default async function AboutPage() {
  const pageData = await getPageBySlug('about');

  if (!pageData) {
    notFound();
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
          {pageData.title}
        </h1>
        {pageData.structured_content?.tagline && (
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            {pageData.structured_content.tagline}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
        <div
          className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: pageData.content || '' }}
        />

        {pageData.structured_content?.imageUrl && (
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={pageData.structured_content.imageUrl}
              alt={pageData.title}
              fill
              className="rounded-lg object-cover shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint="cozy library"
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-headline font-bold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">To provide honest, insightful book reviews and foster a vibrant community of passionate readers.</p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-headline font-bold mb-2">Our Collection</h3>
              <p className="text-muted-foreground">We curate books across various genres, from gripping fiction to life-changing non-fiction.</p>
          </div>
          <div className="flex flex-col items-center p-6 border rounded-lg bg-card">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-headline font-bold mb-2">Join Us</h3>
              <p className="text-muted-foreground">Explore our reviews, find your next favorite book, and share your own thoughts with the world.</p>
          </div>
      </div>
    </main>
  );
}

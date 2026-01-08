import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import { pageService } from '@/lib/services';
import { notFound } from 'next/navigation';


export async function generateMetadata(): Promise<Metadata> {
  const pageData = await pageService.getBySlug('privacy-policy');
  return {
    title: pageData?.title || 'Privacy Policy',
    description: 'Our privacy policy outlines how we collect, use, and protect your information.',
  };
};


export default async function PrivacyPolicyPage() {
  const pageData = await pageService.getBySlug('privacy-policy');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            {pageData.title}
          </h1>
        </div>
        <div
          className="prose dark:prose-invert max-w-none text-base text-muted-foreground leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </main>
      <Footer />
    </div>
  );
}

import { bookService, authorService, pageService, settingsService, categoryService } from '@/lib/services';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookCoverCard } from '@/components/BookCoverCard';
import { BookSearch } from '@/components/BookSearch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from 'react-schemaorg';
import { FAQPage, Question } from 'schema-dts';
import type { Book, Author } from '@/lib/types';
import { ArrowRight, BookOpen, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Revalidate every hour instead of force-dynamic — enables caching while keeping content fresh
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsService.get('general');

  return {
    title: settings?.siteName || 'libribooks | Master 10 Essential Skills Through Books',
    description: 'Master 50 life-changing books across 10 essential skills including Productivity, Communication, and Personal Finance. Read our in-depth summaries, reviews, and notable quotes.',
    alternates: {
      canonical: 'https://www.libribooks.com',
    },
    keywords: [
      'book summaries',
      'book reviews',
      'best books for personal growth',
      'productivity books',
      'communication skills books',
      'personal finance books',
      'self improvement books',
      'must read books',
      'book recommendations',
      'libribooks',
    ],
  };
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function Home() {
  const [allBooks, authors, categories, faqPage, settings] = await Promise.all([
    bookService.getAll(),
    authorService.getAll(),
    categoryService.getAll(),
    pageService.getBySlug('faq'),
    settingsService.get('general'),
  ]);

  const faqItems = faqPage?.structuredContent || [];
  const shuffledBooks = shuffle(allBooks);
  const shuffledAuthors = shuffle(authors.filter(a => a.slug));
  const featuredBooks = allBooks.filter(book => book.featured);
  const categoryNames = ['All', ...categories.map(c => c.name)];

  const tagline = settings?.tagline || "Master Life Skills Through the World's Best Books";
  const heroSubtitle = settings?.heroSubtitle || "We filter thousands of books to bring you the essential guides for mastering productivity, psychology, and personal growth.";

  const schemaFaqs: Question[] = faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  return (
    <>
      <JsonLd<FAQPage>
        item={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: schemaFaqs,
        }}
      />
      <Header />
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Server Rendered */}
        <section className="text-center mb-16 py-12 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Curated Knowledge System
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            {tagline}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/skills">Explore Skills <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link href="#collection">Browse Collection</Link>
            </Button>
          </div>
        </section>

        {/* SEO Content Section - Server Rendered, boosts word count + content rate + relevance */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-2xl font-headline font-bold mb-4">
            Your Guide to the Best Books for Personal Growth
          </h2>
          <div className="text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              At libribooks, we believe the right book can change your life. That is why our team reads
              hundreds of titles each year to select only the most useful and practical books across
              essential life skills. Whether you want to boost your productivity, improve your
              communication, build better habits, or take control of your personal finances, our
              curated collection has you covered.
            </p>
            <p>
              Each book in our library comes with an in-depth summary and review written in clear,
              simple language. We highlight key ideas, notable quotes, and practical takeaways so you
              can quickly decide which books are right for you. Our goal is to make great knowledge
              easy to find and simple to understand for readers at every level.
            </p>
            <p>
              Explore our collection of {allBooks.length} carefully selected books organized across
              {' '}{categories.length} skill categories. From bestselling classics to hidden gems, every
              title has been chosen for its ability to deliver real, lasting results. Start your
              learning journey today and discover your next must-read book.
            </p>
          </div>
        </section>

        {/* Search & Filter Section - Client Island */}
        <section className="max-w-7xl mx-auto mb-12">
          <BookSearch allBooks={shuffledBooks} categories={categoryNames} />
        </section>

        {/* Featured Books - Server Rendered */}
        {featuredBooks.length > 0 && (
          <>
            <Separator className="my-16" />
            <section className="max-w-7xl mx-auto mb-16">
              <h2 className="text-2xl font-headline font-bold mb-8 text-center flex items-center justify-center gap-2">
                <Star className="text-yellow-400" />
                Featured Books
              </h2>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredBooks.map((book) => (
                    <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <div className="p-1">
                        <BookCoverCard book={book} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </section>
          </>
        )}

        <Separator className="my-16" />

        {/* Authors - Server Rendered */}
        <section className="w-full max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-headline font-bold mb-8 text-center">Featured Authors</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {shuffledAuthors.map((author) => (
                <CarouselItem key={author.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <div className="p-2 flex flex-col items-center text-center gap-2">
                    <Link href={`/author/${author.slug}`} className="block group">
                      <div className="relative w-32 h-32">
                        <Image
                          src={author.image}
                          alt={author.name}
                          fill
                          className="rounded-full object-cover transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:scale-105"
                          sizes="128px"
                          data-ai-hint="author portrait"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium group-hover:text-primary transition-colors">{author.name}</p>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>

        <Separator className="my-16" />

        {/* FAQ - Server Rendered */}
        {faqItems.length > 0 && (
          <section className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-headline font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item: { question: string; answer: string }, index: number) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}

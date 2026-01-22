"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookCoverCard } from '@/components/BookCoverCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star } from 'lucide-react';
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

interface HomeClientProps {
  allBooks: Book[];
  authors: Author[];
  faqItems: { question: string; answer: string }[];
  tagline?: string;
  heroSubtitle?: string;
}

export default function HomeClient({ allBooks, authors, faqItems, tagline, heroSubtitle }: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(allBooks.map((book) => book.category)));
    // Shuffle categories (except 'All')
    const shuffled = [...uniqueCategories];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return ['All', ...shuffled];
  }, [allBooks]);
  const featuredBooks = allBooks.filter(book => book.featured);

  const filteredBooks = allBooks.filter((book) => {
    const term = searchTerm.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(term) ||
      book.authors.some(author => author.toLowerCase().includes(term)) ||
      (book.tags && book.tags.some(tag => tag.toLowerCase().includes(term)));

    return matchesCategory && matchesSearch;
  });

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
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            {tagline || "Your Next Literary Adventure"}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {heroSubtitle || "Explore our collection or search for your next favorite read."}
          </p>
        </section>

        <section className="max-w-7xl mx-auto mb-12">
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, author, tag..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {featuredBooks.length > 0 && (
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
        )}

        <Separator className="my-16" />

        <section className="max-w-7xl mx-auto mb-16">
          <h2 className="text-2xl font-headline font-bold mb-6 text-center">Our Collection</h2>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {filteredBooks.map((book) => (
                <BookCoverCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg">No books found.</p>
              <p>Try adjusting your search or category selection.</p>
            </div>
          )}
        </section>

        <Separator className="my-16" />

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
              {authors.map((author) => (
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

        <section className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-headline font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </main>
      <Footer />
    </>
  );
}

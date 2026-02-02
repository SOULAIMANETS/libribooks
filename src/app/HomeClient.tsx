"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookCoverCard } from '@/components/BookCoverCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import type { Book, Author, Category } from '@/lib/types';
import { ArrowRight, BookOpen, Search, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeClientProps {
  allBooks: Book[];
  authors: Author[];
  categories: string[];
  skills: Category[];
  faqItems: { question: string; answer: string }[];
  tagline?: string;
  heroSubtitle?: string;
}

export default function HomeClient({ allBooks, authors, categories, skills, faqItems, tagline, heroSubtitle }: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        <section className="text-center mb-16 py-12 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Curated Knowledge System
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            {tagline || "Master Life Skills Through the World's Best Books"}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            {heroSubtitle || "We filter thousands of books to bring you the essential guides for mastering productivity, psychology, and personal growth."}
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

        {/* Master Essential Skills Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Master Essential Skills</h2>
              <p className="text-muted-foreground">Comprehensive guides and book recommendations for every area of life.</p>
            </div>
            <Link href="/skills" className="text-primary hover:underline font-medium flex items-center gap-1">
              View all 10 skills <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <Link key={skill.id} href={`/skills/${skill.slug}`} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">{skill.icon || '📚'}</div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                      {skill.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
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

        <section id="collection" className="max-w-7xl mx-auto mb-16 scroll-mt-20">
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

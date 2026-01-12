
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { bookService, authorService } from '@/lib/services';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Tag, BookOpen, User, Book as BookIcon, Mic, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BookCoverCard } from '@/components/BookCoverCard';
import { QuoteCard } from '@/components/QuoteCard';
import { SocialShareButtons } from '@/components/SocialShareButtons';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Book as SchemaBook, Review, Person, FAQPage, Question } from 'schema-dts';
import type { Book, Author } from '@/lib/types';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export async function generateStaticParams() {
  const books = await bookService.getAll();
  return books.map((book) => ({
    id: book.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const book = await bookService.getById(params.id);

  if (!book) {
    return {};
  }

  const pageUrl = `/book/${book.id}`;
  const imageUrl = book.coverImage;
  const authorNames = book.authors?.join(', ') || 'Unknown Author';
  const categoryName = book.category?.toLowerCase() || 'book';
  const description = `In-depth review and summary of ${book.title} by ${authorNames}. Discover key insights, notable quotes, and see if this ${categoryName} book is your next life-changing read.`;

  return {
    title: `${book.title} by ${authorNames} | Book Review`,
    description: description,
    openGraph: {
      title: `${book.title} | libribooks.com`,
      description: description,
      url: pageUrl,
      type: 'book',
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 600,
          alt: `Cover of ${book.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} by ${book.authors.join(', ')} | Book Review`,
      description: description,
      images: [imageUrl],
    },
  };
}


export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await bookService.getById(params.id);

  if (!book) {
    notFound();
  }

  const allAuthors = await authorService.getAll();
  const bookAuthors = allAuthors.filter((a) => book.authorIds?.includes(a.id));

  const allBooks = await bookService.getAll();
  const similarBooks = allBooks.filter(
    (b) => b.category === book.category && b.id !== book.id
  ).slice(0, 3);

  const pageUrl = `https://libribooks.com/book/${book.id}`;

  const schemaAuthors: Person[] = bookAuthors.map(author => ({
    '@type': 'Person',
    name: author.name,
    url: `https://libribooks.com/author/${author.id}`,
  }));

  const schemaFaqs: Question[] = book.faq?.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })) || [];


  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd<SchemaBook>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title,
          author: schemaAuthors.length > 1 ? schemaAuthors : schemaAuthors[0],
          image: book.coverImage,
          isbn: `978-${book.id.toString().padStart(10, '0')}`, // Example ISBN
          review: {
            '@type': 'Review',
            reviewBody: book.review,
            author: {
              '@type': 'Person',
              name: 'libribooks.com Team',
            },
          } as Review,
        }}
      />
      {schemaFaqs.length > 0 && (
        <JsonLd<FAQPage>
          item={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: schemaFaqs,
          }}
        />
      )}
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto">
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="rounded-lg object-cover shadow-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="book cover"
                priority
              />
            </div>
          </div>
          <div className="md:col-span-2">
            {book.category && <Badge variant="secondary" className="mb-2">{book.category}</Badge>}
            <h1 className="text-4xl font-headline font-bold">{book.title}</h1>
            <div className="mt-2 text-xl text-muted-foreground flex items-center gap-2">
              by{' '}
              {book.authors?.map((author, index) => (
                <React.Fragment key={book.authorIds?.[index] || index}>
                  {book.authorIds?.[index] ? (
                    <Link href={`/author/${book.authorIds[index]}`} className="text-primary hover:underline">
                      {author}
                    </Link>
                  ) : (
                    <span>{author}</span>
                  )}
                  {index < book.authors!.length - 1 && <span>,</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-4">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {book.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-8 flex-wrap">
              {book.purchaseUrls?.paperback && (
                <Button asChild className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href={book.purchaseUrls.paperback} target="_blank" rel="noopener noreferrer">
                    <BookIcon /> Buy Paperback
                  </a>
                </Button>
              )}
              {book.purchaseUrls?.ebook && (
                <Button asChild className="w-full sm:w-auto" variant="outline">
                  <a href={book.purchaseUrls.ebook} target="_blank" rel="noopener noreferrer">
                    <FileText /> Buy E-book
                  </a>
                </Button>
              )}
              {book.purchaseUrls?.audiobook && (
                <Button asChild className="w-full sm:w-auto" variant="outline">
                  <a href={book.purchaseUrls.audiobook} target="_blank" rel="noopener noreferrer">
                    <Mic /> Buy Audiobook
                  </a>
                </Button>
              )}
              <SocialShareButtons url={pageUrl} title={book.title} />
            </div>

          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Why '{book.title}' is a Must-Read
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{book.review}</p>
        </div>

        {book.quotes && book.quotes.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Notable Quotes from '{book.title}'</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {book.quotes.map((quote, index) => (
                  <QuoteCard key={index} quote={quote} />
                ))}
              </div>
            </div>
          </>
        )}

        {book.faq && book.faq.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {book.faq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </>
        )}


        {similarBooks.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Similar Books to Read Next</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {similarBooks.map((similarBook) => (
                  <BookCoverCard key={similarBook.id} book={similarBook} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}


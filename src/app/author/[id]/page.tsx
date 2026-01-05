
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { authorService, bookService } from '@/lib/services';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { BookCoverCard } from '@/components/BookCoverCard';
import { User, Book } from 'lucide-react';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Person } from 'schema-dts';
import type { Author, Book as BookType } from '@/lib/types';


export async function generateStaticParams() {
  const authors = await authorService.getAll();
  return authors.map((author) => ({
    id: author.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const author = await authorService.getById(params.id);

  if (!author) {
    return {};
  }

  const pageUrl = `/author/${author.id}`;
  const imageUrl = author.image;

  return {
    title: author.name,
    description: author.bio.substring(0, 160),
    openGraph: {
      title: author.name,
      description: author.bio.substring(0, 160),
      url: pageUrl,
      type: 'profile',
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 400,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: author.name,
      description: author.bio.substring(0, 160),
      images: [imageUrl],
    },
  };
}


export default async function AuthorPage({ params }: { params: { id: string } }) {
  const author = await authorService.getById(params.id);

  if (!author) {
    notFound();
  }

  const allBooks = await bookService.getAll();
  const authorBooks = allBooks.filter((b) => b.authorIds.includes(author.id));

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd<Person>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: author.name,
          description: author.bio,
          image: author.image,
          url: `https://libribooks.com/author/${author.id}`,
        }}
      />
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-60 md:h-60">
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="rounded-full object-cover shadow-2xl"
                sizes="(max-width: 768px) 192px, 240px"
                data-ai-hint="author portrait"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
              <User className="w-10 h-10 text-primary" />
              {author.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {author.bio}
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
            <Book className="w-6 h-6 text-primary" />
            Books by {author.name}
          </h2>
          {authorBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {authorBooks.map((book) => (
                <BookCoverCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No books by this author found in our library yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

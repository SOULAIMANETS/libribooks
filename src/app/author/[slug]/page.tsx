import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Person } from 'schema-dts';
import type { Author, Book } from '@/lib/types';
import { db } from '@/lib/db';
import { BookCoverCard } from '@/components/BookCoverCard';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const author = await getAuthor(resolvedParams.slug);

  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found.',
    };
  }

  return {
    title: author.name,
    description: author.bio,
    openGraph: {
      title: author.name,
      description: author.bio,
      images: [
        {
          url: author.image || '',
          alt: author.name,
        },
      ],
    },
  };
}

async function getAuthor(slug: string): Promise<Author | undefined> {
  try {
    const res = await db.query('SELECT id, name, image, bio, slug FROM authors WHERE slug = $1', [slug]);
    if (res.rows.length === 0) {
      return undefined;
    }
    const author = res.rows[0];
    return {
      ...author,
      slug: author.slug,
    } as Author;
  } catch (error) {
    console.error('Error fetching author:', error);
    return undefined;
  }
}

async function getAuthorBooks(authorId: number): Promise<Book[]> {
  try {
    const query = `
      SELECT
        b.id, b.title, b.cover_image as "coverImage", b.slug,
        array_agg(a.name) as authors
      FROM books b
      JOIN book_authors ba ON b.id = ba.book_id
      JOIN authors a ON ba.author_id = a.id
      WHERE ba.author_id = $1
      GROUP BY b.id, b.title, b.cover_image, b.slug
      ORDER BY b.title
    `;
    const res = await db.query(query, [authorId]);
    return res.rows.map((book: any) => ({
      ...book,
      slug: book.slug,
    })) as Book[];
  } catch (error) {
    console.error('Error fetching author books:', error);
    return [];
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const author = await getAuthor(resolvedParams.slug);

  if (!author) {
    notFound();
  }

  const authorBooks = await getAuthorBooks(author.id);

  return (
    <>
      <JsonLd<Person>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: author.name,
          image: author.image || '',
          description: author.bio || '',
        }}
      />
      <main className="flex-1 w-full py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src={author.image || '/uploads/default-author.jpg'}
                alt={author.name}
                fill
                className="rounded-full object-cover border-4 border-primary shadow-lg"
                sizes="(max-width: 768px) 192px, 192px"
                priority
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-foreground">{author.name}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {author.bio || ''}
            </p>
          </div>

          {authorBooks.length > 0 && (
            <>
              <Separator className="mb-8" />

              <section>
                <h2 className="text-2xl font-headline font-bold mb-6 text-center text-foreground">Books by {author.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {authorBooks.map((book) => (
                    <BookCoverCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

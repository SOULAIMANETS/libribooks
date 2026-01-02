import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, Book as BookIcon, MonitorSpeaker, Headphones, Quote, ShoppingCart, Heart, Share2, Navigation, Calendar, Globe, Award, Users, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import { JsonLd } from 'react-schemaorg';
import { Book as SchemaBook } from 'schema-dts';
import { SocialShareButtons } from '@/components/SocialShareButtons';
import { FaqItem } from '@/components/FaqItem';
import type { Book, Author } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Return basic metadata since experimental data has been removed
  return {
    title: 'Book Details',
    description: 'Book details and information.',
  };
}

async function getBook(slug: string): Promise<Book | null> {
  const { db } = await import('@/lib/db');

  try {
    // First, get the basic book data
    const bookQuery = `
      SELECT
        b.id, b.title, b.description, b.cover_image as "coverImage",
        b.featured, b.reviews, b.quotes, b.purchase_urls as "purchase_urls",
        b.faqs, b.slug, c.name as category
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.slug = $1
    `;

    const bookRes = await db.query(bookQuery, [slug]);
    console.log('Query for slug:', slug);
    console.log('Book found:', bookRes.rows.length);

    if (bookRes.rows.length === 0) {
      return null;
    }

    const book = bookRes.rows[0];

    // Get authors for this book
    const authorQuery = `
      SELECT a.id, a.name, a.bio, a.image, a.slug
      FROM authors a
      JOIN book_authors ba ON a.id = ba.author_id
      WHERE ba.book_id = $1
    `;
    const authorRes = await db.query(authorQuery, [book.id]);

    // Get tags for this book
    const tagQuery = `
      SELECT t.name
      FROM tags t
      JOIN book_tags bt ON t.id = bt.tag_id
      WHERE bt.book_id = $1
    `;
    const tagRes = await db.query(tagQuery, [book.id]);

    console.log('Book data:', book);

    return {
      ...book,
      authors: authorRes.rows.map(a => a.name),
      authorIds: authorRes.rows.map(a => a.id),
      tags: tagRes.rows.map(t => t.name),
      reviews: book.reviews || [],
      quotes: book.quotes || [],
      faqs: book.faqs || []
    } as Book;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

async function getBookAuthors(book: Book): Promise<Author[]> {
  const { db } = await import('@/lib/db');

  if (!book.authorIds || book.authorIds.length === 0) {
    return [];
  }

  const query = 'SELECT id, name, bio, image, slug FROM authors WHERE id = ANY($1)';
  try {
    const res = await db.query(query, [book.authorIds]);
    return res.rows.map((author: any) => ({
      ...author,
      slug: author.slug
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      <a href="/" className="hover:text-primary transition-colors font-medium">Home</a>
      <span className="text-muted-foreground/60">/</span>
      <a href="/books" className="hover:text-primary transition-colors font-medium">Books</a>
      <span className="text-muted-foreground/60">/</span>
      <span className="text-foreground font-semibold">Book Details</span>
    </nav>
  );
}

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
    </div>
  );
}

function TableOfContents({ hasQuotes, hasFaqs, hasReviews }: { hasQuotes: boolean; hasFaqs: boolean; hasReviews: boolean }) {
  return (
    <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Navigation className="h-5 w-5 text-primary" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {hasQuotes && (
            <a href="#quotes">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Quotes
              </Button>
            </a>
          )}
          {hasFaqs && (
            <a href="#faqs">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                FAQs
              </Button>
            </a>
          )}
          {hasReviews && (
            <a href="#reviews">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Reviews
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const book = await getBook(resolvedParams.slug);

  if (!book) {
    notFound();
  }

  const authors = await getBookAuthors(book);
  const category = null; // Categories data removed with experimental content

  return (
    <>
      <JsonLd<SchemaBook>
        item={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title,
          description: book.description,
          image: book.coverImage,
          author: authors.map(a => ({ '@type': 'Person', name: a.name })),
        }}
      />
      <main className="flex-1 w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />

          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-2xl bg-card border shadow-lg p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                {/* Book Cover */}
                <div className="lg:col-span-1 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-xl border-2 border-border bg-muted">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={`Cover of ${book.title}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 300px"
                          priority
                          unoptimized
                          style={{
                            backgroundColor: '#f1f5f9',
                            minHeight: '100%'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted min-h-[400px]">
                          <div className="text-center text-muted-foreground">
                            <BookIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-semibold mb-1">No Cover</p>
                            <p className="text-sm">Image not available</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {book.featured && (
                      <div className="absolute -top-2 -left-2 bg-accent-foreground text-accent px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        FEATURED
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title and Author */}
                  <div className="space-y-3">
                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-foreground">
                      {book.title}
                    </h1>
                    <div className="flex items-center gap-3 text-lg text-muted-foreground">
                      <User className="h-5 w-5 text-primary" />
                      <span>by</span>
                      <div className="flex flex-wrap gap-2">
                        {authors.map((author, index) => (
                          <span key={author.id} className="flex items-center gap-2">
                            <a
                              href={`/author/${author.slug}`}
                              className="text-primary hover:underline font-medium"
                            >
                              {author.name}
                            </a>
                            {index < authors.length - 1 && (
                              <span className="text-muted-foreground">,</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-muted/60 rounded-full px-4 py-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-semibold">4.8</span>
                      <span className="text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-muted/30 rounded-xl p-6 border">
                    <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                      {book.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4">
                    <SocialShareButtons
                      url={`http://localhost:3000/book/${book.slug}`}
                      title={book.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Quotes Section */}
              {book.quotes && book.quotes.length > 0 && (
                <Card id="quotes" className="border shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                      <Quote className="h-6 w-6 text-primary" />
                      Inspirational Quotes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {book.quotes.map((quote, index) => (
                      <blockquote key={index} className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 py-4 bg-muted/30 rounded-r-lg">
                        "{quote}"
                      </blockquote>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* FAQs Section */}
              {(book as any).faqs && (book as any).faqs.length > 0 && (
                <Card id="faqs" className="border shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Questions About This Book
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(book as any).faqs.map((faq: { question: string; answer: string }, index: number) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <FaqItem
                            question={faq.question}
                            answer={faq.answer}
                            index={index}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Section */}
              {book.reviews && book.reviews.length > 0 && (
                <Card id="reviews" className="border shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Reader Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {book.reviews.map((review, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{review.author}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <RatingStars rating={review.rating} />
                                <span className="text-sm text-muted-foreground">• Verified Reader</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Purchase Links */}
                {book.purchase_urls && (
                  <Card className="border shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Purchase Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {book.purchase_urls.paperback && (
                        <Button asChild variant="outline" className="w-full justify-start gap-3">
                          <a href={book.purchase_urls.paperback} target="_blank" rel="noopener noreferrer">
                            <BookIcon className="h-4 w-4" />
                            Paperback
                          </a>
                        </Button>
                      )}
                      {book.purchase_urls.ebook && (
                        <Button asChild variant="outline" className="w-full justify-start gap-3">
                          <a href={book.purchase_urls.ebook} target="_blank" rel="noopener noreferrer">
                            <MonitorSpeaker className="h-4 w-4" />
                            E-book
                          </a>
                        </Button>
                      )}
                      {book.purchase_urls.audiobook && (
                        <Button asChild variant="outline" className="w-full justify-start gap-3">
                          <a href={book.purchase_urls.audiobook} target="_blank" rel="noopener noreferrer">
                            <Headphones className="h-4 w-4" />
                            Audio Book
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Table of Contents */}
                <Card className="border shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                      <Navigation className="h-5 w-5 text-primary" />
                      Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {book.quotes && book.quotes.length > 0 && (
                        <a href="#quotes" className="block">
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 p-3 h-auto">
                            <Quote className="h-4 w-4 text-primary" />
                            <div className="text-left">
                              <div className="font-medium text-sm">Quotes</div>
                              <div className="text-xs text-muted-foreground">{book.quotes.length} items</div>
                            </div>
                          </Button>
                        </a>
                      )}
                      {(book as any).faqs && (book as any).faqs.length > 0 && (
                        <a href="#faqs" className="block">
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 p-3 h-auto">
                            <BookIcon className="h-4 w-4 text-primary" />
                            <div className="text-left">
                              <div className="font-medium text-sm">FAQs</div>
                              <div className="text-xs text-muted-foreground">{(book as any).faqs.length} questions</div>
                            </div>
                          </Button>
                        </a>
                      )}
                      {book.reviews && book.reviews.length > 0 && (
                        <a href="#reviews" className="block">
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 p-3 h-auto">
                            <Users className="h-4 w-4 text-primary" />
                            <div className="text-left">
                              <div className="font-medium text-sm">Reviews</div>
                              <div className="text-xs text-muted-foreground">{book.reviews.length} reviews</div>
                            </div>
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

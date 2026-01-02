import { BookCoverCard } from '@/components/BookCoverCard';
import { Search, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from '@/components/ui/separator';

import type { Book, Author } from '@/lib/types';
import { SearchClient } from '@/app/search-client';
import Link from 'next/link';
import Image from 'next/image';
import { getHomePageData } from '@/lib/data';


export default async function Home() {
  const {
    featuredBooks,
    allBooks,
    authors,
    categories
  } = await getHomePageData();

  return (
    <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
          Your Next Literary Adventure
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore our collection or search for your next favorite read.
        </p>
      </section>

      <SearchClient allBooks={allBooks} categories={categories} />

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

      {/* This section is now handled by the SearchClient component */}
      
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
             {(authors as Author[]).map((author) => (
              <CarouselItem key={author.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                 <div className="p-2 flex flex-col items-center text-center gap-2">
                    <Link href={`/author/${author.slug}`} className="block group">
                      <div className="relative w-32 h-32">
                         <Image
                          src={author.image || '/uploads/default-author.jpg'}
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
    </main>
  );
}

"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookCoverCard } from '@/components/BookCoverCard';
import { Search } from 'lucide-react';
import type { Book } from '@/lib/types';

const INITIAL_DISPLAY_COUNT = 18;

interface BookSearchProps {
  allBooks: Book[];
  categories: string[];
}

export function BookSearch({ allBooks, categories }: BookSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allBooks.filter((book) => {
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      const matchesSearch =
        book.title.toLowerCase().includes(term) ||
        book.authors.some(author => author.toLowerCase().includes(term)) ||
        (book.tags && book.tags.some(tag => tag.toLowerCase().includes(term)));

      return matchesCategory && matchesSearch;
    });
  }, [allBooks, searchTerm, selectedCategory]);

  const visibleBooks = filteredBooks.slice(0, displayCount);
  const hasMore = filteredBooks.length > displayCount;

  return (
    <>
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, author, tag..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDisplayCount(INITIAL_DISPLAY_COUNT);
            }}
          />
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory(category);
              setDisplayCount(INITIAL_DISPLAY_COUNT);
            }}
          >
            {category}
          </Button>
        ))}
      </div>

      {visibleBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {visibleBooks.map((book) => (
              <BookCoverCard key={book.id} book={book} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setDisplayCount(prev => prev + INITIAL_DISPLAY_COUNT)}
                className="rounded-full px-8"
              >
                Show More Books ({filteredBooks.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg">No books found.</p>
          <p>Try adjusting your search or category selection.</p>
        </div>
      )}
    </>
  );
}

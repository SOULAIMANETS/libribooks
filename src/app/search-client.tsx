"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { BookCoverCard } from '@/components/BookCoverCard';
import type { Book, Category } from '@/lib/types'; // Import Category type

interface SearchClientProps {
  allBooks: Book[];
  categories: string[]; // Assuming categories are passed as strings
}

export function SearchClient({ allBooks, categories }: SearchClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = allBooks.filter((book) => {
    const term = searchTerm.toLowerCase();
    // Corrected category comparison: compare category name string with selectedCategory string
    const matchesCategory = selectedCategory === 'All' || book.category?.name === selectedCategory;
    
    const matchesSearch =
      book.title.toLowerCase().includes(term) ||
      // Corrected author search: access author.name before calling toLowerCase()
      (book.authors && Array.isArray(book.authors) && book.authors.some(author => author.name.toLowerCase().includes(term))) ||
      (book.tags && Array.isArray(book.tags) && book.tags.some(tag => tag.toLowerCase().includes(term)));
      
    return matchesCategory && matchesSearch;
  });

  return (
    <>
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
    </>
  );
}

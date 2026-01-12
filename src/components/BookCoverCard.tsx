import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface BookCoverCardProps {
  book: Book;
}

export function BookCoverCard({ book }: BookCoverCardProps) {
  return (
    <Link href={`/book/${book.slug || book.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1 border-2 border-transparent hover:border-primary">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
              data-ai-hint="book cover"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

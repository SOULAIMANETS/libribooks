
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <SearchX className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-6xl font-headline font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-muted-foreground">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            Go Back Home
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}

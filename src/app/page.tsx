import { bookService, authorService, pageService, settingsService } from '@/lib/services';
import HomeClient from './HomeClient';


export const dynamic = 'force-dynamic';

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function Home() {
  const allBooks = await bookService.getAll();
  const authors = await authorService.getAll();
  const faqPage = await pageService.getBySlug('faq');
  const faqItems = faqPage?.structuredContent || [];
  // Randomize books and authors on each request
  const shuffledBooks = shuffle(allBooks);
  const shuffledAuthors = shuffle(authors);

  // Randomize categories on each request (keeping 'All' first)
  const uniqueCategories = Array.from(new Set(allBooks.map((book) => book.category)));
  const shuffledCategories = ['All', ...shuffle(uniqueCategories)];

  return (
    <HomeClient
      allBooks={shuffledBooks}
      authors={shuffledAuthors}
      categories={shuffledCategories}
      faqItems={faqItems}
      tagline={settings?.tagline}
      heroSubtitle={settings?.heroSubtitle}
    />
  );
}

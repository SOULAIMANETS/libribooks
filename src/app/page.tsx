import { bookService, authorService, pageService, settingsService, categoryService } from '@/lib/services';
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
  const categories = await categoryService.getAll();
  const faqPage = await pageService.getBySlug('faq');
  const faqItems = faqPage?.structuredContent || [];
  const settings = await settingsService.get('general');
  // Randomize books and authors on each request
  const shuffledBooks = shuffle(allBooks);
  const shuffledAuthors = shuffle(authors.filter(a => a.slug));

  // For the filtering buttons, we want just the names
  const categoryNames = ['All', ...categories.map(c => c.name)];

  return (
    <HomeClient
      allBooks={shuffledBooks}
      authors={shuffledAuthors}
      categories={categoryNames}

      faqItems={faqItems}
      tagline={settings?.tagline}
      heroSubtitle={settings?.heroSubtitle}
    />
  );
}

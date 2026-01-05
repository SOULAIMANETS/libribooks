import { bookService, authorService, pageService } from '@/lib/services';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allBooks = await bookService.getAll();
  const authors = await authorService.getAll();
  const faqPage = await pageService.getBySlug('faq');
  const faqItems = faqPage?.structuredContent || [];

  return (
    <HomeClient
      allBooks={allBooks}
      authors={authors}
      faqItems={faqItems}
    />
  );
}

import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  // -------- books -------------------------------------------------
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select(`
      id,
      title,
      slug,
      rating,
      cover_image_url,
      authors:book_authors ( author_id, authors (*) ),
      tags:book_tags ( tags (*) )
    `);

  if (booksError) {
    console.error('Error fetching books:', booksError);
    return new Response('Error loading books', { status: 500 });
  }

  // -------- articles -----------------------------------------------
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select(`id, title, slug, author_name, date, excerpt`);

  if (articlesError) {
    console.error('Error fetching articles:', articlesError);
    return new Response('Error loading articles', { status: 500 });
  }

  // helpers ---------------------------------------------------------
  const formatAuthors = (authorObjs: any[]) =>
    authorObjs.map((a: any) => a.name).filter(Boolean).join(', ') || 'Unknown';

  const formatTags = (tagObjs: any[]) => tagObjs.map((t: any) => t.name).filter(Boolean).join(', ') || 'No tags';

  // -------- markdown builder ----------------------------------------
  let markdown = '# Libribooks Content Summary for AI Crawlers\n\n';

  // Books
  markdown += '## Books\n\n';
  (books || []).forEach((book: any) => {
    const authors = formatAuthors(book.authors);
    const tags = formatTags(book.tags);
    const rating = book.rating ?? 'N/A';
    const summary = book.ai_summary || 'No AI summary available.';
    markdown += `- **${book.title}** (slug: ${book.slug})\n`;
    markdown += `  - Authors: ${authors}\n`;
    markdown += `  - Tags: ${tags}\n`;
    markdown += `  - Rating: ${rating}/5.0\n`;
    markdown += `  - AI Summary: ${summary}\n\n`;
  });

  // Articles
  markdown += '## Articles\n\n';
  (articles || []).forEach((article: any) => {
    const summary = article.ai_summary || article.excerpt || 'No AI summary available.';
    markdown += `- **${article.title}** (slug: ${article.slug})\n`;
    markdown += `  - Author: ${article.author_name}\n`;
    markdown += `  - Date: ${new Date(article.date).toLocaleDateString()}\n`;
    markdown += `  - AI Summary: ${summary}\n\n`;
  });

  // -------- response ------------------------------------------------
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
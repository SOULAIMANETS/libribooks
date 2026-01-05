import { bookService, articleService, authorService } from '@/lib/services';

const URL = 'https://libribooks.com';

export async function GET() {
  const pages = [
    '',
    '/articles',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy-policy',
    '/cookie-policy',
  ];

  const [books, articles, authors] = await Promise.all([
    bookService.getAll(),
    articleService.getAll(),
    authorService.getAll()
  ]);

  const bookUrls = books.map(book => `/book/${book.id}`);
  const articleUrls = articles.map(article => `/articles/${article.slug}`);
  const authorUrls = authors.map(author => `/author/${author.id}`);

  const allUrls = [...pages, ...bookUrls, ...articleUrls, ...authorUrls];

  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${allUrls
      .map((path) => {
        return `
            <url>
              <loc>${URL}${path}</loc>
              <lastmod>${today}</lastmod>
            </url>
          `;
      })
      .join('')}
      ${books.map(book => `
        <url>
            <loc>${URL}/book/${book.id}</loc>
            <lastmod>${today}</lastmod>
            <image:image>
                <image:loc>${book.coverImage}</image:loc>
                <image:title>${book.title.replace(/&/g, '&amp;')}</image:title>
                <image:caption>${`Cover of the book ${book.title.replace(/&/g, '&amp;')}`.substring(0, 1024)}</image:caption>
            </image:image>
        </url>
      `).join('')}
       ${articles.map(article => `
        <url>
            <loc>${URL}/articles/${article.slug}</loc>
            <lastmod>${article.date}</lastmod>
            <image:image>
                <image:loc>${article.coverImage}</image:loc>
                <image:title>${article.title.replace(/&/g, '&amp;')}</image:title>
                <image:caption>${article.excerpt.replace(/&/g, '&amp;').substring(0, 1024)}</image:caption>
            </image:image>
        </url>
      `).join('')}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

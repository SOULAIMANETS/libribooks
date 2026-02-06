import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { categoryService, articleService } from '@/lib/services';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, User, Home, ArrowRight } from 'lucide-react';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';

export async function generateStaticParams() {
    const categories = await categoryService.getAll();
    const params: { skill: string; article: string }[] = [];

    for (const category of categories) {
        const allArticles = await articleService.getAll();
        const articles = allArticles.filter(a => a.skillSlug === category.slug);
        for (const article of articles) {
            params.push({
                skill: category.slug!,
                article: article.slug,
            });
        }
    }

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string; article: string }> }): Promise<Metadata> {
    const { article: articleSlug } = await params;
    const article = await articleService.getBySlug(articleSlug);

    if (!article) {
        return {};
    }

    // Use custom SEO fields if set, otherwise fallback to title/excerpt
    const seoTitle = article.metaTitle || article.title;
    const seoDescription = article.metaDescription || article.excerpt;

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            type: 'article',
            publishedTime: new Date(article.date).toISOString(),
            authors: [article.author],
            images: article.coverImage ? [{ url: article.coverImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: article.coverImage ? [article.coverImage] : [],
        },
    };
}

export default async function SkillArticlePage({ params }: { params: Promise<{ skill: string; article: string }> }) {
    const { skill: skillSlug, article: articleSlug } = await params;

    const [category, article, allArticles] = await Promise.all([
        categoryService.getBySlug(skillSlug),
        articleService.getBySlug(articleSlug),
        articleService.getAll(),
    ]);

    if (!category || !article) {
        notFound();
    }

    // Filter related articles for this skill
    const relatedArticles = allArticles.filter(a => a.skillSlug === skillSlug && a.slug !== article.slug).slice(0, 4);

    // Function to inject auto-links into content (FIRST OCCURRENCE ONLY)
    const injectAutoLinks = (content: string, links: { keyword: string; url: string }[]) => {
        if (!links || links.length === 0) return content;

        let processedContent = content;
        // Sort by keyword length (longest first) to avoid matching sub-words incorrectly
        const sortedLinks = [...links].sort((a, b) => b.keyword.length - a.keyword.length);

        sortedLinks.forEach(({ keyword, url }) => {
            // Regex to match the keyword outside of HTML tags (FIRST OCCURRENCE ONLY - no 'g' flag)
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Match only if:
            // 1. Not preceded by a character that would be inside a tag (simplified)
            // 2. Word boundary on both sides
            // 3. Not inside an existing <a> tag (basic check)
            const regex = new RegExp(`(?<!<[^>]*)\\b${escapedKeyword}\\b(?![^<]*>)`, 'u');

            // Replace only the FIRST match
            processedContent = processedContent.replace(regex, (match) => {
                return `<a href="${url}" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">${match}</a>`;
            });
        });

        return processedContent;
    };

    const displayContent = injectAutoLinks(article.content, article.keywordLinks || []);

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd<SchemaArticle>
                item={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: article.title,
                    author: {
                        '@type': 'Person',
                        name: article.author,
                    },
                    image: article.coverImage,
                    datePublished: new Date(article.date).toISOString(),
                    description: article.excerpt,
                }}
            />
            <Header />
            <main className="flex-1 w-full py-8">
                {/* Breadcrumb */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary flex items-center gap-1">
                            <Home className="h-3 w-3" /> Home
                        </Link>
                        <span>/</span>
                        <Link href="/skills" className="hover:text-primary">Skills</Link>
                        <span>/</span>
                        <Link href={`/skills/${category.slug}`} className="hover:text-primary">{category.name}</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate max-w-[200px]">{article.title}</span>
                    </nav>
                </div>

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Article Role Badge */}
                    {article.articleRole && (
                        <div className="mb-4">
                            <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full capitalize">
                                {article.articleRole.replace('-', ' ')}
                            </span>
                        </div>
                    )}

                    {/* Cover Image */}
                    {article.coverImage && (
                        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                            <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 896px"
                                priority
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{article.title}</h1>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>

                    <Separator className="mb-8" />

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-ol:list-decimal prose-ul:list-disc"
                        dangerouslySetInnerHTML={{ __html: displayContent }}
                    />

                    {/* Back to Skill Link */}
                    <div className="mt-12 pt-8 border-t">
                        <Link
                            href={`/skills/${category.slug}`}
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            &larr; Back to {category.name} Guide
                        </Link>
                    </div>
                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <Separator className="mb-12" />
                        <h2 className="text-2xl font-headline font-bold mb-8">
                            More from {category.name}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {relatedArticles.map((related) => (
                                <Link key={related.slug} href={`/skills/${category.slug}/${related.slug}`} className="group">
                                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">
                                                {related.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {related.excerpt}
                                            </p>
                                            <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read More <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

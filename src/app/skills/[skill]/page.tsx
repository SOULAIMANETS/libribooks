import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { categoryService, articleService } from '@/lib/services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Home, BookOpen } from 'lucide-react';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';

export async function generateStaticParams() {
    const categories = await categoryService.getAll();
    return categories.map((category) => ({
        skill: category.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
    const { skill: skillSlug } = await params;
    const category = await categoryService.getBySlug(skillSlug);

    if (!category) {
        return {};
    }

    return {
        title: `${category.name} - Complete Guide`,
        description: category.description,
        openGraph: {
            title: `${category.name} - Complete Guide | Libribooks`,
            description: category.description,
            type: 'article',
            images: category.coverImage ? [{ url: category.coverImage }] : [],
        },
    };
}

export default async function SkillPillarPage({ params }: { params: Promise<{ skill: string }> }) {
    const { skill: skillSlug } = await params;
    const result = await categoryService.getWithBooks(skillSlug);

    if (!result) {
        notFound();
    }

    const { category, books } = result;

    // Also fetch articles for this skill (if any are tagged with this skill)
    const allArticles = await articleService.getAll();
    const relatedArticles = allArticles.filter(a => a.skillSlug === skillSlug);

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd<SchemaArticle>
                item={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: `${category.name} - Complete Guide`,
                    description: category.description,
                    image: category.coverImage,
                }}
            />
            <Header />
            <main className="flex-1 w-full">
                {/* Breadcrumb */}
                <div className="bg-muted/50 border-b">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary flex items-center gap-1">
                                <Home className="h-3 w-3" /> Home
                            </Link>
                            <span>/</span>
                            <Link href="/skills" className="hover:text-primary">Skills</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">{category.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <section className="relative py-16 bg-gradient-to-br from-primary/5 to-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {category.icon && <div className="text-5xl mb-4">{category.icon}</div>}
                        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">
                            {category.name}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {category.description}
                        </p>
                    </div>
                </section>

                {/* Pillar Content */}
                {category.pillarContent && (
                    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-ol:list-decimal prose-ul:list-disc"
                            dangerouslySetInnerHTML={{ __html: category.pillarContent }}
                        />
                    </article>
                )}

                {/* Books Section */}
                {books.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <Separator className="mb-12" />
                        <div className="flex items-center gap-2 mb-8">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-headline font-bold">
                                Best {category.name} Books
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {books.map((book) => (
                                <Link key={book.id} href={`/book/${book.slug}`} className="group">
                                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            <Image
                                                src={book.coverImage}
                                                alt={book.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors line-clamp-2">
                                                {book.title}
                                            </CardTitle>
                                            <CardDescription>
                                                by {book.authors.join(', ')}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                View Book <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <Separator className="mb-12" />
                        <h2 className="text-2xl font-headline font-bold mb-8">
                            In-Depth Guides & Insights
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {relatedArticles.map((article) => (
                                <Link key={article.slug} href={`/skills/${category.slug}/${article.slug}`} className="group">
                                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            {article.articleRole && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize w-fit mb-2">
                                                    {article.articleRole.replace('-', ' ')}
                                                </span>
                                            )}
                                            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">
                                                {article.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {article.excerpt}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
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

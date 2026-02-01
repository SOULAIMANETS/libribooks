import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { skillService, articleService } from '@/lib/services';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, User, Home, ArrowRight } from 'lucide-react';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';

export async function generateStaticParams() {
    const skills = await skillService.getAll();
    const params: { skill: string; article: string }[] = [];

    for (const skill of skills) {
        const articles = await articleService.getBySkill(skill.slug);
        for (const article of articles) {
            params.push({
                skill: skill.slug,
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

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: new Date(article.date).toISOString(),
            authors: [article.author],
            images: article.coverImage ? [{ url: article.coverImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.coverImage ? [article.coverImage] : [],
        },
    };
}

export default async function SkillArticlePage({ params }: { params: Promise<{ skill: string; article: string }> }) {
    const { skill: skillSlug, article: articleSlug } = await params;

    const [skill, article, relatedArticles] = await Promise.all([
        skillService.getBySlug(skillSlug),
        articleService.getBySlug(articleSlug),
        articleService.getBySkill(skillSlug),
    ]);

    if (!skill || !article) {
        notFound();
    }

    // Filter out current article from related
    const otherArticles = relatedArticles.filter(a => a.slug !== article.slug).slice(0, 4);

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
                        <Link href={`/skills/${skill.slug}`} className="hover:text-primary">{skill.name}</Link>
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
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Back to Skill Link */}
                    <div className="mt-12 pt-8 border-t">
                        <Link
                            href={`/skills/${skill.slug}`}
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            &larr; Back to {skill.name} Guide
                        </Link>
                    </div>
                </article>

                {/* Related Articles */}
                {otherArticles.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <Separator className="mb-12" />
                        <h2 className="text-2xl font-headline font-bold mb-8">
                            More from {skill.name}
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {otherArticles.map((related) => (
                                <Link key={related.slug} href={`/skills/${skill.slug}/${related.slug}`} className="group">
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

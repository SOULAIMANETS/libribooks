import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { skillService } from '@/lib/services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Home } from 'lucide-react';
import { JsonLd } from 'react-schemaorg';
import { Article as SchemaArticle } from 'schema-dts';

export async function generateStaticParams() {
    const skills = await skillService.getAll();
    return skills.map((skill) => ({
        skill: skill.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
    const { skill: skillSlug } = await params;
    const skill = await skillService.getBySlug(skillSlug);

    if (!skill) {
        return {};
    }

    return {
        title: `${skill.name} - Complete Guide`,
        description: skill.description,
        openGraph: {
            title: `${skill.name} - Complete Guide | Libribooks`,
            description: skill.description,
            type: 'article',
            images: skill.coverImage ? [{ url: skill.coverImage }] : [],
        },
    };
}

export default async function SkillPillarPage({ params }: { params: Promise<{ skill: string }> }) {
    const { skill: skillSlug } = await params;
    const result = await skillService.getWithArticles(skillSlug);

    if (!result) {
        notFound();
    }

    const { skill, articles } = result;

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd<SchemaArticle>
                item={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: `${skill.name} - Complete Guide`,
                    description: skill.description,
                    image: skill.coverImage,
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
                            <span className="text-foreground font-medium">{skill.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <section className="relative">
                    {skill.coverImage && (
                        <div className="absolute inset-0 h-64 overflow-hidden">
                            <Image
                                src={skill.coverImage}
                                alt={skill.name}
                                fill
                                className="object-cover opacity-20"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                        </div>
                    )}
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                        {skill.icon && <div className="text-5xl mb-4">{skill.icon}</div>}
                        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">
                            {skill.name}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            {skill.description}
                        </p>
                    </div>
                </section>

                {/* Pillar Content */}
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Separator className="mb-8" />

                    {skill.pillarContent ? (
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-ol:list-decimal prose-ul:list-disc"
                            dangerouslySetInnerHTML={{ __html: skill.pillarContent }}
                        />
                    ) : (
                        <p className="text-muted-foreground italic">
                            Comprehensive guide coming soon...
                        </p>
                    )}
                </article>

                {/* Related Articles */}
                {articles.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <Separator className="mb-12" />
                        <h2 className="text-2xl font-headline font-bold mb-8">
                            In-Depth Guides & Insights
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {articles.map((article) => (
                                <Link key={article.slug} href={`/skills/${skill.slug}/${article.slug}`} className="group">
                                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                {article.articleRole && (
                                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                                                        {article.articleRole.replace('-', ' ')}
                                                    </span>
                                                )}
                                            </div>
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

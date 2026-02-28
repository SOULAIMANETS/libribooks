import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { skillService, articleService } from '@/lib/services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Home, BookOpen } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';

interface PageProps {
    params: Promise<{ skill: string }>;
}

export async function generateStaticParams() {
    const skills = await skillService.getAll();
    return skills.map((skill) => ({
        skill: skill.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { skill: slug } = await params;
    const skill = await skillService.getBySlug(slug);

    if (!skill) return { title: 'Skill Not Found' };

    return {
        title: `${skill.name} - Master this Skill | Libribooks`,
        description: skill.description,
        openGraph: {
            title: skill.name,
            description: skill.description,
            images: skill.coverImage ? [skill.coverImage] : [],
        },
    };
}

export default async function SkillPillarPage({ params }: PageProps) {
    const { skill: slug } = await params;
    const data = await skillService.getWithArticles(slug);

    if (!data) {
        notFound();
    }

    const { skill, articles } = data;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                    {skill.coverImage ? (
                        <>
                            <Image
                                src={skill.coverImage}
                                alt={skill.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/60" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-primary/10" />
                    )}

                    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Link href="/" className="text-white/80 hover:text-white transition-colors">
                                <Home className="h-5 w-5" />
                            </Link>
                            <span className="text-white/40">/</span>
                            <Link href="/skills" className="text-white/80 hover:text-white transition-colors">
                                Skills
                            </Link>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
                            {skill.icon && <span className="mr-4">{skill.icon}</span>}
                            {skill.name}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                            {skill.description}
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Pillar Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Pillar Content / Guide */}
                            <section className="prose prose-lg prose-primary max-w-none">
                                <div
                                    className="pillar-content-rendered"
                                    dangerouslySetInnerHTML={{ __html: skill.pillarContent }}
                                />
                            </section>

                            <Separator />

                            {/* Articles List */}
                            <section>
                                <h2 className="text-3xl font-headline font-bold mb-8">Related Articles & Guides</h2>
                                <div className="grid gap-6">
                                    {articles.map((article) => (
                                        <ArticleCard key={article.slug} article={article} />
                                    ))}

                                    {articles.length === 0 && (
                                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">More guides coming soon!</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8">
                            <Card className="bg-primary/5 border-none">
                                <CardHeader>
                                    <CardTitle>About this Skill</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-4">
                                    <p>
                                        Our {skill.name} roadmap is designed to take you from foundational concepts to advanced mastery through carefully selected reading and actionable insights.
                                    </p>
                                    <div className="pt-4">
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Total Guides</div>
                                        <div className="text-3xl font-headline font-bold text-primary">{articles.length}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Share / CTA */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Want more?</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="mb-4 text-muted-foreground">
                                        Subscribe to get our weekly reading lists and summary notes delivered to your inbox.
                                    </p>
                                    <Link href="/newsletter">
                                        <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium">
                                            Join Newsletter
                                        </button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

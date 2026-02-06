import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { skillService } from '@/lib/services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Skills - Master Life Through Reading',
    description: 'Explore our curated reading guides organized by skill. Find the right books to master productivity, psychology, money, and more.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SkillsPage() {
    const skills = await skillService.getAll();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 w-full">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <BookOpen className="h-4 w-4" />
                            Knowledge System
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground mb-6">
                            Master Life Through Reading
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                            We don&apos;t just recommend books. We help you find the <strong>right book</strong> for the <strong>right skill</strong>.
                            Each skill has a comprehensive guide plus curated books to help you master it.
                        </p>
                    </div>
                </section>

                {/* Skills Grid */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-headline font-bold mb-8">Explore Skills</h2>

                    {skills.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No skills available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {skills.map((skill) => (
                                <Link key={skill.id} href={`/skills/${skill.slug}`} className="group">
                                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                                        {skill.coverImage && (
                                            <div className="relative h-40 w-full overflow-hidden">
                                                <Image
                                                    src={skill.coverImage}
                                                    alt={skill.name}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                {skill.icon && (
                                                    <div className="absolute bottom-3 left-3 text-3xl">
                                                        {skill.icon}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors flex items-center gap-2">
                                                {skill.icon && !skill.coverImage && <span className="text-2xl">{skill.icon}</span>}
                                                {skill.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {skill.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Explore Guide <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

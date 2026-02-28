import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
    article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/articles/${article.slug}`}>
            <Card className="hover:shadow-md transition-shadow group">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {article.coverImage && (
                            <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        )}
                        <div className="flex-grow">
                            <h3 className="text-xl font-headline font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2 text-sm mb-4">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center text-primary text-sm font-medium">
                                Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

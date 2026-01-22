
import { authorService } from '@/lib/services';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const authors = await authorService.getAll();
        const results = [];

        for (const author of authors) {
            if (!author.slug) {
                const generatedSlug = author.name
                    .toLowerCase()
                    .trim()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, '');

                await authorService.update(author.id, { slug: generatedSlug });
                results.push({ name: author.name, status: 'fixed', slug: generatedSlug });
            } else {
                results.push({ name: author.name, status: 'already-has-slug', slug: author.slug });
            }
        }

        return NextResponse.json({
            success: true,
            processed: authors.length,
            details: results
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

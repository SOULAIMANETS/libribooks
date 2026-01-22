
import { authorService } from '@/lib/services';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const authors = await authorService.getAll();
        const results = [];

        for (const author of authors) {
            const generatedSlug = author.name
                .toLowerCase()
                .trim()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            // Update if no slug, if slug is a number, or if it doesn't match the name
            if (!author.slug || !isNaN(Number(author.slug)) || author.slug !== generatedSlug) {
                await authorService.update(author.id, { slug: generatedSlug });
                results.push({ name: author.name, status: 'fixed', oldSlug: author.slug, newSlug: generatedSlug });
            } else {
                results.push({ name: author.name, status: 'already-correct', slug: author.slug });
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


import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

async function main() {
    console.log('--- Populating Book Slugs ---');

    const { data: books, error: fetchError } = await supabaseAdmin
        .from('books')
        .select('id, title, slug');

    if (fetchError) {
        console.error('❌ Error fetching books:', fetchError);
        return;
    }

    console.log(`Found ${books.length} books.`);

    for (const book of books) {
        if (!book.slug) {
            const slug = generateSlug(book.title);
            console.log(`Generating slug for "${book.title}": ${slug}`);

            const { error: updateError } = await supabaseAdmin
                .from('books')
                .update({ slug })
                .eq('id', book.id);

            if (updateError) {
                console.error(`❌ Error updating book ${book.id}:`, updateError);
            } else {
                console.log(`✅ Updated book ${book.id}`);
            }
        } else {
            console.log(`- Book ${book.id} already has slug: ${book.slug}`);
        }
    }

    console.log('--- Slug Population Complete ---');
}

main();

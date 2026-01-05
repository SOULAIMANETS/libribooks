import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for migration

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const LIB_DIR = path.join(process.cwd(), 'src', 'lib');

async function migrate() {
    console.log('Starting migration...');

    // 1. Categories
    console.log('Migrating categories...');
    const categoriesData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'categories.json'), 'utf-8'));
    for (const cat of categoriesData) {
        const { error } = await supabase.from('categories').upsert({ id: cat.id, name: cat.name });
        if (error) console.error(`Error migrating category ${cat.name}:`, error.message);
    }

    // 2. Tags
    console.log('Migrating tags...');
    const tagsData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'tags.json'), 'utf-8'));
    for (const tag of tagsData) {
        const { error } = await supabase.from('tags').upsert({ id: tag.id, name: tag.name });
        if (error) console.error(`Error migrating tag ${tag.name}:`, error.message);
    }

    // 3. Authors
    console.log('Migrating authors...');
    const authorsData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'authors.json'), 'utf-8'));
    for (const author of authorsData) {
        const { error } = await supabase.from('authors').upsert({
            id: author.id,
            name: author.name,
            image_url: author.image,
            bio: author.bio
        });
        if (error) console.error(`Error migrating author ${author.name}:`, error.message);
    }

    // 4. Books
    console.log('Migrating books...');
    const booksData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'data.json'), 'utf-8'));
    for (const book of booksData) {
        // Find category ID
        const { data: catData } = await supabase.from('categories').select('id').eq('name', book.category).single();

        const { data: insertedBook, error: bookError } = await supabase.from('books').upsert({
            id: book.id,
            title: book.title,
            cover_image_url: book.coverImage,
            review: book.review,
            purchase_urls: book.purchaseUrls,
            category_id: catData?.id || null,
            featured: book.featured,
            faq: book.faq,
            quotes: book.quotes
        }).select().single();

        if (bookError) {
            console.error(`Error migrating book ${book.title}:`, bookError.message);
            continue;
        }

        // Book-Author Relation
        if (book.authorIds) {
            for (const authorId of book.authorIds) {
                await supabase.from('book_authors').upsert({ book_id: book.id, author_id: authorId });
            }
        }

        // Book-Tag Relation
        if (book.tags) {
            for (const tagName of book.tags) {
                const { data: tagData } = await supabase.from('tags').select('id').eq('name', tagName).single();
                if (tagData) {
                    await supabase.from('book_tags').upsert({ book_id: book.id, tag_id: tagData.id });
                }
            }
        }
    }

    // 5. Articles
    console.log('Migrating articles...');
    const articlesData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'articles.json'), 'utf-8'));
    for (const article of articlesData) {
        const { error } = await supabase.from('articles').upsert({
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            cover_image_url: article.coverImage,
            author_name: article.author,
            date: article.date
        });
        if (error) console.error(`Error migrating article ${article.title}:`, error.message);
    }

    // 6. Users
    console.log('Migrating users...');
    const usersData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'users.json'), 'utf-8'));
    for (const user of usersData) {
        const { error } = await supabase.from('users').upsert({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        if (error) console.error(`Error migrating user ${user.email}:`, error.message);
    }

    // 7. Pages
    console.log('Migrating pages...');
    const pagesData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'pages.json'), 'utf-8'));
    // pages.json is an array
    for (const page of pagesData) {
        const { error } = await supabase.from('pages').upsert({
            slug: page.slug,
            title: page.title,
            content: page.content,
            structured_content: page.structuredContent
        });
        if (error) console.error(`Error migrating page ${page.slug}:`, error.message);
    }

    // 8. Popup Ads
    console.log('Migrating popup ads...');
    const popupAdsData = JSON.parse(fs.readFileSync(path.join(LIB_DIR, 'popupAds.json'), 'utf-8'));
    for (const ad of popupAdsData) {
        const { error } = await supabase.from('popup_ads').upsert({
            id: ad.id,
            name: ad.name,
            content: ad.content,
            display_delay: ad.displayDelay,
            display_duration: ad.displayDuration,
            is_active: ad.isActive
        });
        if (error) console.error(`Error migrating popup ad ${ad.name}:`, error.message);
    }

    console.log('Migration finished!');
}

migrate();

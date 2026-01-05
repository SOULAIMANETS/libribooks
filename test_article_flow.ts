
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testArticleFlow() {
    console.log('--- Starting Test Article Flow ---');
    const testSlug = `test-article-${Date.now()}`;
    const testArticle = {
        slug: testSlug,
        title: 'Test Automated Article',
        excerpt: 'This is a test article created by an automated script to verify Supabase connectivity.',
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
        cover_image_url: 'https://images.unsplash.com/photo-1481627546682-09f896b92a7a',
        author_name: 'Admin Test',
        date: new Date().toISOString().split('T')[0]
    };

    try {
        // 1. Create Article
        console.log(`Step 1: Creating article with slug "${testSlug}"...`);
        const { error: insertError } = await supabase
            .from('articles')
            .insert(testArticle);

        if (insertError) throw insertError;
        console.log('✅ Article created successfully.');

        // 2. Fetch Article
        console.log('Step 2: Fetching the created article...');
        const { data, error: fetchError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', testSlug)
            .single();

        if (fetchError) throw fetchError;
        if (data.title !== testArticle.title) {
            throw new Error(`Data mismatch: expected "${testArticle.title}", got "${data.title}"`);
        }
        console.log('✅ Article fetched and verified.');

        // 3. Delete Article
        console.log('Step 3: Deleting the test article...');
        const { error: deleteError } = await supabase
            .from('articles')
            .delete()
            .eq('slug', testSlug);

        if (deleteError) throw deleteError;
        console.log('✅ Article deleted successfully.');

        console.log('--- Test Article Flow Completed Successfully ---');
    } catch (error: any) {
        console.error('❌ Test failed:', error.message);
    }
}

testArticleFlow();

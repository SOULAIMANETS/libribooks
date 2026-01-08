import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticlesTable() {
    console.log("=== Checking Articles Table Schema ===\n");

    // Check table structure
    const { data: schemaData, error: schemaError } = await supabase.rpc('get_table_columns', {
        table_name: 'articles'
    });

    // Alternative: Direct query to check columns
    const { data: columns, error: colError } = await supabase
        .from('articles')
        .select('*')
        .limit(0);

    if (colError) {
        console.log("Error checking columns:", colError.message);
    }

    // Try to fetch articles without specifying id
    console.log("\n=== Attempting to Fetch Articles (without id) ===");
    const { data: articlesNoId, error: errorNoId } = await supabase
        .from('articles')
        .select('slug, title, author_name, date')
        .limit(5);

    if (errorNoId) {
        console.error("❌ Error fetching articles (no id):", errorNoId.message);
    } else {
        console.log(`✅ Successfully fetched ${articlesNoId?.length || 0} articles`);
        if (articlesNoId && articlesNoId.length > 0) {
            articlesNoId.forEach((a, i) => {
                console.log(`  ${i + 1}. ${a.title} (slug: ${a.slug})`);
            });
        }
    }

    // Try to fetch articles WITH id field
    console.log("\n=== Attempting to Fetch Articles (with id) ===");
    const { data: articlesWithId, error: errorWithId } = await supabase
        .from('articles')
        .select('*')
        .limit(5);

    if (errorWithId) {
        console.error("❌ Error fetching articles (with id):", errorWithId.message);
        console.log("\n⚠️  The 'id' column is still missing from the articles table!");
        console.log("   Please run the SQL fix in Supabase SQL Editor.");
    } else {
        console.log(`✅ Successfully fetched ${articlesWithId?.length || 0} articles with id`);
        if (articlesWithId && articlesWithId.length > 0) {
            articlesWithId.forEach((a, i) => {
                console.log(`  ${i + 1}. ${a.title}`);
                console.log(`     - ID: ${a.id || 'MISSING'}`);
                console.log(`     - Slug: ${a.slug}`);
            });
        } else {
            console.log("   No articles found in the database.");
        }
    }

    // Try to insert a test article
    console.log("\n=== Testing Article Creation ===");
    const testSlug = `test-${Date.now()}`;
    const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert({
            title: 'Test Article تجربة',
            slug: testSlug,
            author_name: 'Test Bot',
            date: new Date().toISOString(),
            excerpt: 'Test excerpt for verification',
            content: '<p>Test content</p>',
            cover_image_url: 'https://picsum.photos/400/300'
        })
        .select();

    if (insertError) {
        console.error("❌ Failed to create test article:", insertError.message);
    } else {
        console.log("✅ Test article created successfully!");
        console.log("   Article data:", newArticle);

        // Clean up
        await supabase.from('articles').delete().eq('slug', testSlug);
        console.log("   (Cleaned up test article)");
    }
}

checkArticlesTable();

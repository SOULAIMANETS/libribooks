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

async function checkArticles() {
    console.log("Fetching all articles...\n");

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching articles:", error);
        process.exit(1);
    }

    if (data.length === 0) {
        console.log("No articles found in database.");
    } else {
        console.log(`Found ${data.length} articles:\n`);
        data.forEach((article, index) => {
            console.log(`${index + 1}. Title: "${article.title}"`);
            console.log(`   Slug: "${article.slug}"`);
            console.log(`   Author: "${article.author_name}"`);
            console.log(`   Date: ${article.date}`);
            console.log(`   ID: ${article.id || 'N/A'}`);
            console.log('');
        });
    }

    // Check for articles with Arabic titles
    const { data: arabicArticles } = await supabase
        .from('articles')
        .select('*')
        .ilike('title', '%تجربة%');

    if (arabicArticles && arabicArticles.length > 0) {
        console.log(`\nFound ${arabicArticles.length} articles with Arabic titles:`);
        arabicArticles.forEach(a => console.log(`  - ${a.title}`));
    }
}

checkArticles();

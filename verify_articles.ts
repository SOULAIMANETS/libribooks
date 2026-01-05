
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

async function verify() {
    console.log('Verifying functionality for Articles...');

    // Test 1: Check if table can be accessed
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .limit(5);

    if (error) {
        console.error('❌ Error connecting to database or fetching articles:', error.message);
        return;
    }

    console.log(`✅ Connection successful. Found ${data.length} articles.`);
    console.log('------------------------------------------------');
    data.forEach(article => {
        console.log(`- [${article.slug}] ${article.title}`);
        console.log(`  Author: ${article.author_name}, Date: ${article.date}`);
    });
    console.log('------------------------------------------------');
    console.log('Articles system verification complete.');
}

verify();

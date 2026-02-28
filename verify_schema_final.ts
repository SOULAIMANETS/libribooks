import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("=== Verifying Articles Table Schema ===\n");
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .limit(1);

    if (error) {
        console.error("❌ Error fetching data:", error.message);
        return;
    }

    const columns = Object.keys(data[0] || {});
    const expectedColumns = [
        'id', 'slug', 'title', 'excerpt', 'content', 'cover_image_url',
        'author_name', 'date', 'skill_slug', 'article_role',
        'keyword_links', 'meta_title', 'meta_description'
    ];

    console.log("Current Columns:", columns.join(", "));
    console.log("\nChecking for missing columns...");

    const missing = expectedColumns.filter(c => !columns.includes(c));

    if (missing.length === 0) {
        console.log("✅ All expected columns are present!");
    } else {
        console.log("⚠️  Missing columns:", missing.join(", "));
    }
}

verify();

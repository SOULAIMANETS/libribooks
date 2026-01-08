
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role key to bypass RLS for verification script
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCreateArticle() {
    const article = {
        title: "Backend Verification Test",
        slug: `backend-test-${Date.now()}`,
        excerpt: "This is a test article created via verification script.",
        content: "<p>This content verifies the database accepts insertions.</p>",
        cover_image_url: "https://picsum.photos/800/600",
        author_name: "System Bot",
        date: new Date().toISOString()
    };

    console.log("Attempting to create article:", article.slug);

    const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

    if (error) {
        console.error("Error creating article:", error);
        process.exit(1);
    }

    console.log("Success! Article created with ID:", data.id);

    // Clean up
    const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', data.id);

    if (deleteError) {
        console.error("Error cleaning up:", deleteError);
    } else {
        console.log("Cleaned up (deleted) test article.");
    }
}

testCreateArticle();

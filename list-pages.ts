
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listPages() {
    const { data, error } = await supabase
        .from('pages')
        .select('title, slug, content');

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    console.log("\n--- Pages ---");
    data.forEach(page => {
        console.log(`Title: "${page.title}" | Slug: "${page.slug}"`);
        console.log(`Content Preview: ${(page.content || "").substring(0, 50)}...`);
        console.log("-------------");
    });
}

listPages();

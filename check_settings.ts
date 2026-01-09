
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'general')
        .single();

    if (error) {
        console.error("Error fetching settings:", error.message);
        return;
    }

    console.log("\n--- General Settings ---");
    console.log(JSON.stringify(data.value, null, 2));
}

checkSettings();

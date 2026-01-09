
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the service role key to bypass RLS for this test
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyWrite() {
    const key = 'verification_test_update';
    console.log(`Attempting to write to 'settings' table (Key: ${key})...`);

    // 1. First Upsert (Insert)
    console.log("1. Performing FIRST Upsert (Should Insert)...");
    const testValue1 = { test: "first_write", timestamp: new Date().toISOString() };
    const { data: data1, error: error1 } = await supabase
        .from('settings')
        .upsert({ key, value: testValue1, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error1) {
        console.error("FIRST Write FAILED:", error1.message);
        return;
    }
    console.log("FIRST Write SUCCESS.");

    // 2. Second Upsert (Update)
    console.log("2. Performing SECOND Upsert (Should Update)...");
    const testValue2 = { test: "second_write_update", timestamp: new Date().toISOString() };
    const { data: data2, error: error2 } = await supabase
        .from('settings')
        .upsert({ key, value: testValue2, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error2) {
        console.error("SECOND Write FAILED (Update failed):", error2.message);
        console.error("Details:", error2);
    } else {
        console.log("SECOND Write SUCCESS (Update worked).");
    }

    // Clean up
    console.log("Cleaning up...");
    await supabase.from('settings').delete().eq('key', key);
    console.log("Done.");
}

verifyWrite();

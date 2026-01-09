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

async function setupMessagesTable() {
    console.log("Setting up messages table...\n");

    // Create the table
    const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    });

    if (createError) {
        console.log("Note: Table may already exist or RPC not available. Trying direct insert test...\n");
    }

    // Test if table exists by trying to query it
    const { data, error: testError } = await supabase
        .from('messages')
        .select('count')
        .limit(1);

    if (testError) {
        console.error("❌ Messages table does NOT exist!");
        console.error("Error:", testError.message);
        console.log("\n📋 SOLUTION:");
        console.log("You must run the SQL script in Supabase SQL Editor:");
        console.log("File: create_messages_table.sql\n");
        process.exit(1);
    }

    console.log("✅ Messages table exists!");

    // Test insertion
    console.log("\nTesting message insertion...");
    const { data: insertData, error: insertError } = await supabase
        .from('messages')
        .insert({
            name: 'Test Script',
            email: 'test@script.com',
            message: 'Testing message insertion from script',
            is_read: false
        })
        .select()
        .single();

    if (insertError) {
        console.error("❌ Failed to insert message:", insertError.message);
        process.exit(1);
    }

    console.log("✅ Message inserted successfully!");
    console.log("   ID:", insertData.id);

    // Clean up
    await supabase.from('messages').delete().eq('id', insertData.id);
    console.log("✅ Cleaned up test message\n");
    console.log("🎉 Everything is working correctly!");
}

setupMessagesTable();

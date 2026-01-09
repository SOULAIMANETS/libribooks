
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey || !anonKey) {
    console.error("Missing keys");
    process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceKey);
const authClient = createClient(supabaseUrl, anonKey);

async function diagnose() {
    console.log("--- Diagnosing Messages Table ---");

    // 1. Check if table exists and has data (Service Role)
    console.log("1. Checking table access (Service Role)...");
    const { data: adminData, error: adminError } = await adminClient
        .from('messages')
        .select('*')
        .limit(5);

    if (adminError) {
        console.error("   ❌ Service Role Read Failed:", adminError.message);
        if (adminError.code === '42P01') {
            console.error("   ⚠️  Table 'messages' does not exist!");
        }
        return;
    }
    console.log(`   ✅ Service Role Read Success. Found ${adminData.length} messages.`);


    // 2. Simulate User Submission (Service Role - like the API)
    console.log("\n2. Simulating User Submission (API behavior)...");
    const testMsg = {
        name: "Test Visitor",
        email: "visitor@example.com",
        message: "This is a test message from diagnosis script.",
        is_read: false
    };

    const { data: insertData, error: insertError } = await adminClient
        .from('messages')
        .insert(testMsg)
        .select()
        .single();

    if (insertError) {
        console.error("   ❌ Service Role Insert Failed:", insertError.message);
    } else {
        console.log("   ✅ Service Role Insert Success. New ID:", insertData.id);
    }


    // 3. Simulate Admin Retrieval (Authenticated User)
    console.log("\n3. Simulating Admin View (Authenticated)...");

    // Create temp user and login
    const email = `admin_test_${Date.now()}@example.com`;
    const password = "Password123!";

    try {
        const { data: user, error: createError } = await adminClient.auth.admin.createUser({
            email, password, email_confirm: true
        });
        if (createError) throw createError;

        const { error: loginError } = await authClient.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;

        // Try to read
        const { data: userData, error: userError } = await authClient
            .from('messages')
            .select('*');

        if (userError) {
            console.error("   ❌ Authenticated Read Failed:", userError.message);
        } else {
            if (userData.length === 0 && (adminData.length > 0 || insertData)) {
                console.error("   ⚠️  Authenticated Read Success but returned 0 rows (RLS Blocking?)");
            } else {
                console.log(`   ✅ Authenticated Read Success. Found ${userData.length} messages.`);
            }
        }

        // Cleanup user
        await adminClient.auth.admin.deleteUser(user.user.id);

    } catch (e) {
        console.error("   ❌ Auth flow failed:", e.message);
    }

    // Cleanup test message
    if (insertData) {
        await adminClient.from('messages').delete().eq('id', insertData.id);
    }
}

diagnose();

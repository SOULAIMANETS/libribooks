
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

// 1. Admin client for user management
const adminClient = createClient(supabaseUrl, serviceKey);

// 2. Auth client (simulating browser)
const authClient = createClient(supabaseUrl, anonKey);

async function runTest() {
    const email = `test_rls_${Date.now()}@example.com`;
    const password = "Password123!";
    let userId = null;

    try {
        console.log("1. Creating temporary test user...");
        const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (createError) throw new Error(`Failed to create user: ${createError.message}`);
        userId = userData.user.id;
        console.log("   User created:", userId);

        console.log("2. Signing in as test user...");
        const { data: sessionData, error: loginError } = await authClient.auth.signInWithPassword({
            email,
            password
        });

        if (loginError) throw new Error(`Failed to login: ${loginError.message}`);
        console.log("   Logged in successfully.");

        // 3. Attempt Upsert
        console.log("3. Attempting UPSERT as authenticated user...");
        const updateKey = 'rls_test_key';
        const updateValue = { foo: 'bar' };

        // Note: checking if standard upsert works without onConflict
        const { data, error: upsertError } = await authClient
            .from('settings')
            .upsert({ key: updateKey, value: updateValue, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (upsertError) {
            console.error("   ❌ UPSERT FAILED with RLS user:", upsertError.message);
            console.error("   Details:", upsertError);
        } else {
            console.log("   ✅ UPSERT SUCCESS:", data);
        }

    } catch (err) {
        console.error("Test failed with exception:", err.message);
    } finally {
        if (userId) {
            console.log("4. Cleaning up test user...");
            await adminClient.auth.admin.deleteUser(userId);
            // clean up setting row if it was created
            await adminClient.from('settings').delete().eq('key', 'rls_test_key');
            console.log("   Cleanup done.");
        }
    }
}

runTest();

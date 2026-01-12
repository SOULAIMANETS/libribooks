
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('Reading migration file (add_book_slug.sql)...');
    const sqlPath = path.join(process.cwd(), 'add_book_slug.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('Attempting to execute SQL via exec_sql RPC...');
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } else {
        console.log('✅ Migration executed successfully!');
    }
}

runMigration();

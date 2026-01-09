import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('Reading migration file...');
    const sqlPath = path.join(process.cwd(), 'create_messages_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('Attempting to execute SQL via exec_sql RPC...');
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('The "exec_sql" RPC function might not exist in your database.');
        console.log('Please run the SQL manually in Supabase Dashboard.');
        process.exit(1);
    } else {
        console.log('✅ Migration executed successfully!');
        console.log('Messages table and RLS policies have been created.');
    }
}

runMigration();

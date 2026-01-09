import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role } = body;

        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Create a Supabase client with the SERVICE_ROLE key to manage users
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: { name, role },
        });

        if (authError) {
            console.error('Error creating auth user:', authError);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // 2. Create the user record in the public.users table
        // Note: If you have a trigger that automatically creates a public user from auth.users, 
        // you might need to UPDATE it instead of INSERT. 
        // Assuming manual management for now based on previous code analysis.

        // Check if user already exists in public table (via trigger potentially)
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        let userError;

        if (existingUser) {
            // Update existing record
            const { error } = await supabaseAdmin
                .from('users')
                .update({ name, email, role })
                .eq('email', email);
            userError = error;
        } else {
            // Insert new record
            const { error } = await supabaseAdmin
                .from('users')
                .insert({
                    name,
                    email,
                    role,
                    // If your public.users table uses the same ID as auth.users, include it:
                    // id: authData.user.id 
                });
            userError = error;
        }

        if (userError) {
            console.error('Error creating public user profile:', userError);
            // Optional: Delete the auth user if profile creation fails?
            // await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, user: authData.user });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

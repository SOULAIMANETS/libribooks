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
            user_metadata: { name, role: role.toLowerCase() },
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
                .update({ name, email, role: role.toLowerCase() })
                .eq('email', email);
            userError = error;
        } else {
            // Insert new record
            const { error } = await supabaseAdmin
                .from('users')
                .insert({
                    name,
                    email,
                    role: role.toLowerCase(),
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

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, email, password, name, role } = body;

        // Note: id here should be the Supabase Auth User ID (UUID) if possible, 
        // but if the frontend is passing the numeric ID from the users table, 
        // we need to find the email or auth ID first.
        // Assuming the 'id' passed is the one from the public.users table (number)

        if (!id || !email || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Find the user in public.users to get their email (if updating by ID)
        // or just use the provided email to find the auth user.
        const { data: userData, error: userFetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (userFetchError || !userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Update Supabase Auth
        // We need the auth.users.id. If public.users.id is not the same as auth.users.id,
        // we'd need a column in public.users to store the auth_id.
        // Let's check if we can find the user by email in Auth.
        const { data: authUserList, error: authFetchError } = await supabaseAdmin.auth.admin.listUsers();
        if (authFetchError) throw authFetchError;

        const authUser = authUserList.users.find(u => u.email === userData.email);
        if (!authUser) {
            return NextResponse.json({ error: 'Auth user not found' }, { status: 404 });
        }

        const updateData: any = {
            email,
            user_metadata: { name, role: role.toLowerCase() },
        };
        if (password) {
            updateData.password = password;
        }

        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
            authUser.id,
            updateData
        );

        if (authUpdateError) {
            return NextResponse.json({ error: authUpdateError.message }, { status: 400 });
        }

        // 3. Update public.users table
        const { error: publicUpdateError } = await supabaseAdmin
            .from('users')
            .update({ name, email, role: role.toLowerCase() })
            .eq('id', id);


        if (publicUpdateError) {
            return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Get user email from public.users
        const { data: userData, error: userFetchError } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('id', id)
            .single();

        if (userFetchError || !userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Find and delete from Supabase Auth
        const { data: authUserList, error: authFetchError } = await supabaseAdmin.auth.admin.listUsers();
        if (authFetchError) throw authFetchError;

        const authUser = authUserList.users.find(u => u.email === userData.email);
        if (authUser) {
            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);
            if (authDeleteError) {
                console.error('Error deleting auth user:', authDeleteError);
                // Continue anyway to delete from public table? 
                // Usually better to keep them in sync.
            }
        }

        // 3. Delete from public.users table
        const { error: publicDeleteError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', id);

        if (publicDeleteError) {
            return NextResponse.json({ error: 'Failed to delete user profile' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}



import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create Supabase client (use anon key for public insertion)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Insert message into database
        const { data, error } = await supabase
            .from('messages')
            .insert({
                name,
                email,
                message,
                is_read: false
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving message:', error);
            return NextResponse.json(
                { error: 'Failed to save message' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

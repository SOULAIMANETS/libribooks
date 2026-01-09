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

        // Create Supabase client (use service role key for bypass RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
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
            console.error('Supabase error saving message:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json(
                {
                    error: 'Failed to save message',
                    details: error.message,
                    code: error.code
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, data },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Unexpected error in contact API:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error?.message },
            { status: 500 }
        );
    }
}

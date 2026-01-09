import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Use service role key to bypass RLS
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profile, error } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single();

        if (error) {
            console.error('Error fetching user role:', error);
            // If user not found in public table but is authenticated, handle gracefully?
            return NextResponse.json({ role: 'Editor' }); // Default to safe role or return error?
        }

        return NextResponse.json({ role: profile?.role || 'Editor' });

    } catch (error) {
        console.error('Unexpected error in /api/auth/role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
    const { supabaseResponse, user } = await updateSession(req);

    // If user is not signed in and current path is /admin/dashboard/* or /editor/dashboard/*
    if (!user && (req.nextUrl.pathname.startsWith('/admin/dashboard') || req.nextUrl.pathname.startsWith('/editor/dashboard'))) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based redirection is better handled in the layout or page components 
    // because middleware doesn't have easy access to the public.users table role
    // However, basic auth protection is done here.

    return supabaseResponse;
}

export const config = {
    matcher: ['/admin/:path*', '/editor/:path*'],
};

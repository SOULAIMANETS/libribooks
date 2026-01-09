import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
    const { supabaseResponse, user } = await updateSession(req);

    // If user is signed in and current path is /admin/login, redirect to /admin/dashboard
    // if (user && req.nextUrl.pathname === '/admin/login') {
    //     return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    // }

    // If user is not signed in and current path is /admin/dashboard/*, redirect to /admin/login
    // if (!user && req.nextUrl.pathname.startsWith('/admin/dashboard')) {
    //     return NextResponse.redirect(new URL('/admin/login', req.url));
    // }

    return supabaseResponse;
}

export const config = {
    matcher: ['/admin/:path*'],
};

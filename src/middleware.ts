import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // If user is signed in and current path is /admin/login, redirect to /admin/dashboard
    if (session && req.nextUrl.pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // If user is not signed in and current path is /admin/dashboard/*, redirect to /admin/login
    if (!session && req.nextUrl.pathname.startsWith('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};

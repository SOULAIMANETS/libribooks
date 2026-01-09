'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileText,
    tag,
    LogOut,
    Menu,
    X,
    User,
    Tags,
    Library
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userService } from '@/lib/services';

const menuItems = [
    {
        name: 'Overview',
        href: '/editor/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Books',
        href: '/editor/dashboard/books',
        icon: BookOpen,
    },
    {
        name: 'Articles',
        href: '/editor/dashboard/articles',
        icon: FileText,
    },
    {
        name: 'Categories',
        href: '/editor/dashboard/categories',
        icon: Library
    },
    {
        name: 'Tags',
        href: '/editor/dashboard/tags',
        icon: Tags
    },
    {
        name: 'Authors',
        href: '/editor/dashboard/authors',
        icon: Users
    }
];

export default function EditorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/admin/login');
                return;
            }

            try {
                const profile = await userService.getByEmail(user.email!);
                if (!profile || profile.role !== 'Editor') {
                    // If not editor, redirect to appropriate place or show error
                    // For now, let's redirect to admin login if they shouldn't be here
                    router.push('/admin/login');
                    return;
                }
                setUser(profile);
            } catch (e) {
                console.error("Error fetching user profile", e);
                router.push('/admin/login');
                return;
            }

            setLoading(false);
        };

        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="flex bg-slate-50 items-center justify-center h-screen w-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
                    <p className="text-slate-600 font-medium animate-pulse">Loading Editor Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-100">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    <span className="font-bold text-xl text-slate-800">LibriBooks</span>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium ml-2">Editor</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3">
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden -ml-2"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* Add header actions here if needed */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

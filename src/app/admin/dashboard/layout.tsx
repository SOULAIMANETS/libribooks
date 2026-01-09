'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookCopy,
  Users,
  FileText,
  Settings,
  PanelLeft,
  Book,
  Users2,
  FilePenLine,
  Bookmark,
  Tag,
  MessageSquare,
  LogOut,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/books', label: 'Books', icon: BookCopy, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/authors', label: 'Authors', icon: Users, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/articles', label: 'Articles', icon: FileText, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: Bookmark, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/tags', label: 'Tags', icon: Tag, roles: ['admin', 'editor'] },
  { href: '/admin/dashboard/inbox', label: 'Inbox', icon: Mail, roles: ['admin'] },
  { href: '/admin/dashboard/popups', label: 'Popups', icon: MessageSquare, roles: ['admin'] },
  { href: '/admin/dashboard/pages', label: 'Pages', icon: FilePenLine, roles: ['admin'] },
  { href: '/admin/dashboard/users', label: 'Users', icon: Users2, roles: ['admin'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch user role from API which bypasses RLS
        const response = await fetch('/api/auth/role');
        const data = await response.json();

        if (response.ok && data.role) {
          setRole(data.role);
        } else {
          console.error('Failed to fetch role via API', data);
          setRole('Editor'); // Fallback
        }

      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [router]);

  // Protect routes
  useEffect(() => {
    if (!role || loading) return;

    // Check if current path is restricted
    const restrictedPathsForEditor = [
      '/admin/dashboard/users',
      '/admin/dashboard/settings',
      '/admin/dashboard/inbox',
      '/admin/dashboard/popups',
      '/admin/dashboard/pages'
    ];

    if (role === 'editor') {
      const isRestricted = restrictedPathsForEditor.some(path => pathname.startsWith(path));
      if (isRestricted) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this page.",
          variant: "destructive"
        });
        router.push('/admin/dashboard');
      }
    }
  }, [pathname, role, loading, router, toast]);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      router.push('/login');
    }
  };

  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 2) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role || 'editor'));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Button asChild variant="ghost" className="p-1 h-auto">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
                  <Book className="h-7 w-7 text-primary" />
                  <span className="group-data-[collapsible=icon]:hidden">libribooks</span>
                </Link>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:p-2">
            <SidebarMenu>
              {role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/admin/dashboard/settings'}
                    tooltip={{ children: "Settings" }}
                  >
                    <Link href="/admin/dashboard/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}

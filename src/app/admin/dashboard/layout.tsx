
'use client';

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
} from 'lucide-react';

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
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/dashboard/books', label: 'Books', icon: BookCopy },
  { href: '/admin/dashboard/authors', label: 'Authors', icon: Users },
  { href: '/admin/dashboard/articles', label: 'Articles', icon: FileText },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: Bookmark },
  { href: '/admin/dashboard/tags', label: 'Tags', icon: Tag },
  { href: '/admin/dashboard/popups', label: 'Popups', icon: MessageSquare },
  { href: '/admin/dashboard/pages', label: 'Pages', icon: FilePenLine },
  { href: '/admin/dashboard/users', label: 'Users', icon: Users2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 2) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  };

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
              {menuItems.map((item) => (
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
                <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      isActive={pathname === '/admin/dashboard/settings'}
                      tooltip={{children: "Settings"}}
                    >
                      <Link href="/admin/dashboard/settings">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
            <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>
                </div>
                <ThemeToggle />
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookCopy,
  Users,
  FileText,
  PanelLeft,
  Book,
  Users2,
  FilePenLine,
  Bookmark,
  Tag,
  MessageSquare,
  Settings,
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
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
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <DashboardContent pathname={pathname} children={children} />
    </SidebarProvider>
  );
}

function DashboardContent({ pathname, children }: { pathname: string; children: React.ReactNode; }) {
  const { open } = useSidebar();

  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 2) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-full bg-background [&_.group\/sidebar-wrapper]:min-h-0 [&_[data-sidebar=inset]]:min-h-0 [&_[data-sidebar=sidebar]]:h-full">
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
        </Sidebar>

        <SidebarInset className="min-h-0">
            <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>
                </div>
            </header>
            <main className={cn("flex-1 p-4 sm:p-6 transition-all duration-200", open && "ml-64")}>
                <div className={cn("w-full", open && "pr-4")}>
                    {children}
                </div>
            </main>
        </SidebarInset>
      </div>
    </ThemeProvider>
  );
}

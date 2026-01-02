'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PopupContainer } from '@/components/PopupContainer';
import { Toaster } from '@/components/ui/toaster';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
      <Toaster />
      {!isAdmin && <PopupContainer />}
      <div className="hidden">
        <div className="bg-background text-foreground"></div>
        <div className="bg-card text-card-foreground"></div>
        <div className="bg-popover text-popover-foreground"></div>
        <div className="bg-primary text-primary-foreground"></div>
        <div className="bg-secondary text-secondary-foreground"></div>
        <div className="bg-muted text-muted-foreground"></div>
        <div className="bg-accent text-accent-foreground"></div>
        <div className="bg-destructive text-destructive-foreground"></div>
        <div className="border"></div>
        <div className="ring"></div>
      </div>
    </>
  );
}

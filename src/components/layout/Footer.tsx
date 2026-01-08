
"use client";

import Link from 'next/link';
import { Twitter, Facebook, Youtube, Book } from 'lucide-react';
import { appearanceSettings } from '@/lib/siteConfig';
import { useSiteSettings } from '@/components/SiteSettingsContext';

const PinterestIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 0 5.396 0 12.017c0 7.02 6.024 11.42 10.965 10.965.233-.04.42-.234.42-.482 0-.2-.04-.52-.08-.68-.16-.64-.96-3.88-.96-3.88s-.24-.48-.24-1.2c0-1.12.68-1.96 1.52-1.96.72 0 1.08.52 1.08 1.16 0 .72-.44 1.76-.68 2.76-.2 1.28.64 2.32 1.88 2.32 2.24 0 3.96-2.88 3.96-6.4 0-3.32-2.4-5.64-5.64-5.64-3.88 0-6.08 2.88-6.08 5.48 0 .8.28 1.64.64 2.08.08.08.08.16.04.28-.04.12-.16.48-.2.64-.04.12-.12.16-.24.08-1.4-1.04-2.28-3.12-2.28-4.96 0-4.12 3.04-7.44 8.24-7.44 4.44 0 7.84 3.24 7.84 7.24 0 4.6-2.88 8.16-6.96 8.16-1.4 0-2.72-.76-3.16-1.64h-.04c-.28.88-.88 2.2-1.24 2.84-.28.48-.52.88-.84 1.24.52.12 1.04.16 1.56.16 6.64 0 12.017-5.377 12.017-12.017C24.017 5.396 18.656 0 12.017 0z"></path></svg>
);



export function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = useSiteSettings();

  return (
    <footer className="border-t">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
              <Book className="h-6 w-6 text-primary" />
              <span>libribooks.com</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {settings.footerDescription || "Your friendly corner of the internet for discovering amazing books and sharing the love of reading."}
            </p>
            <div className="flex justify-start gap-4">
              {settings.socialLinks?.twitter && (
                <Link href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></Link>
              )}
              {settings.socialLinks?.facebook && (
                <Link href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Facebook className="h-5 w-5" /></Link>
              )}
              {settings.socialLinks?.pinterest && (
                <Link href={settings.socialLinks.pinterest} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><PinterestIcon /></Link>
              )}
              {settings.socialLinks?.youtube && (
                <Link href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Youtube className="h-5 w-5" /></Link>
              )}
            </div>
          </div>

          <div className="md:col-span-1"></div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {appearanceSettings.quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {appearanceSettings.legalLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} libribooks.com. All rights reserved.
          </p>
          {settings.footerCreditsText && settings.footerCreditsUrl && (
            <p className="text-xs text-muted-foreground mt-2">
              <Link href={settings.footerCreditsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                {settings.footerCreditsText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

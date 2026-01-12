
import type { Metadata } from 'next';
import { Literata, Space_Grotesk, Inter, Montserrat, Roboto, Lora } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { JsonLd } from 'react-schemaorg';
import { WebSite } from 'schema-dts';
import { appearanceSettings } from '@/lib/siteConfig';
import { PopupContainer } from '@/components/PopupContainer';
import { popupAdService, settingsService } from '@/lib/services';
import { SiteSettingsProvider } from '@/components/SiteSettingsContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
  weight: ['400', '700'],
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700'],
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});


const fontMapper = {
  space_grotesk: spaceGrotesk,
  inter: inter,
  montserrat: montserrat,
  literata: literata,
  roboto: roboto,
  lora: lora,
}

const headlineFont = fontMapper[appearanceSettings.headlineFont as keyof typeof fontMapper];
const bodyFont = fontMapper[appearanceSettings.bodyFont as keyof typeof fontMapper];

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seoSettings] = await Promise.all([
    settingsService.get('general'),
    settingsService.get('seo')
  ]);

  const siteConfig = {
    name: seoSettings?.defaultTitle || settings?.siteName || 'libribooks.com',
    url: 'https://libribooks.com',
    description: seoSettings?.metaDescription || settings?.tagline || 'Discover your next favorite book with our insightful reviews, articles, and author interviews.',
    ogImage: 'https://libribooks.com/og.jpg',
    favicon: settings?.faviconUrl || '/favicon.ico',
    keywords: seoSettings?.globalKeywords ? seoSettings.globalKeywords.split(',').map((k: string) => k.trim()) : [],
  };

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@libribooks',
    },
    icons: {
      icon: siteConfig.favicon,
    },
    verification: seoSettings?.googleSiteVerification ? {
      google: seoSettings.googleSiteVerification,
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeAds, settings, seoSettings] = await Promise.all([
    popupAdService.getActive(),
    settingsService.get('general'),
    settingsService.get('seo')
  ]);

  const siteSettings = settings || { siteName: 'libribooks.com' };
  const enableSchema = seoSettings?.enableSchema ?? true;

  return (
    <html lang="en" suppressHydrationWarning className={cn(headlineFont.variable, bodyFont.variable)}>
      <head>
        {enableSchema && (
          <JsonLd<WebSite>
            item={{
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: seoSettings?.defaultTitle || siteSettings.siteName,
              url: 'https://libribooks.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: `https://libribooks.com/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              } as any,
            }}
          />
        )}
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteSettingsProvider settings={siteSettings}>
            {children}
            <Toaster />
            <PopupContainer initialAds={activeAds} />
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

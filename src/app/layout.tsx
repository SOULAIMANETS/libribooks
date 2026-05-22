
import type { Metadata, Viewport } from 'next';
import { Literata, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { JsonLd } from 'react-schemaorg';
import { WebSite } from 'schema-dts';
import { PopupContainer } from '@/components/PopupContainer';
import { popupAdService, settingsService } from '@/lib/services';
import { SiteSettingsProvider } from '@/components/SiteSettingsContext';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '700'],
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
  weight: ['400', '700'],
});

const headlineFont = spaceGrotesk;
const bodyFont = literata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030711' },
  ],
}



export async function generateMetadata(): Promise<Metadata> {
  const [settings, seoSettings, integrations] = await Promise.all([
    settingsService.get('general'),
    settingsService.get('seo'),
    settingsService.get('integrations')
  ]);

  const siteConfig = {
    name: seoSettings?.defaultTitle || settings?.siteName || 'libribooks.com',
    url: 'https://www.libribooks.com',
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
  const [activeAds, settings, seoSettings, integrations] = await Promise.all([
    popupAdService.getActive(),
    settingsService.get('general'),
    settingsService.get('seo'),
    settingsService.get('integrations')
  ]);

  const siteSettings = settings || { siteName: 'libribooks.com' };
  const enableSchema = seoSettings?.enableSchema ?? true;

  return (
    <html lang="en" suppressHydrationWarning className={cn(headlineFont.variable, bodyFont.variable)}>
      <head />
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        {enableSchema && (
          <JsonLd<WebSite>
            item={{
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: seoSettings?.defaultTitle || siteSettings.siteName,
              url: 'https://www.libribooks.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: `https://www.libribooks.com/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              } as any,
            }}
          />
        )}
        {integrations?.googleTagManagerId && (
          <>
            <Script id="gtm-script" strategy="lazyOnload">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${integrations.googleTagManagerId}');
              `}
            </Script>
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${integrations.googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
            />
          </>
        )}
        {integrations?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}`}
              strategy="lazyOnload"
            />
            <Script id="ga-script" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${integrations.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
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

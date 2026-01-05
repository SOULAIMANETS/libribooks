
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
import { popupAdService } from '@/lib/services';

const siteConfig = {
  name: 'libribooks.com',
  url: 'https://libribooks.com',
  description: 'Discover your next favorite book with our insightful reviews, articles, and author interviews.',
  ogImage: 'https://libribooks.com/og.jpg',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
    icon: '/favicon.ico',
  },
};


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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeAds = await popupAdService.getActive();

  return (
    <html lang="en" suppressHydrationWarning className={cn(headlineFont.variable, bodyFont.variable)}>
      <head>
        <JsonLd<WebSite>
          item={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteConfig.url}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }}
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <PopupContainer initialAds={activeAds} />
        </ThemeProvider>
      </body>
    </html>
  );
}

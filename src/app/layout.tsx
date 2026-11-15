import type { Metadata, Viewport } from 'next';

import { Footer } from '@/shared/components/ui/Footer';
import { Navbar } from '@/shared/components/ui/Navbar';
import { fontVariables } from '@/shared/lib/fonts';
import { siteConfig } from '@/shared/lib/site-config';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ['turismo', 'Centroamérica', 'viajes', 'clima', 'lugares turísticos', 'destinos'],
  openGraph: {
    type: 'website',
    locale: 'es_419',
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1a1f' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Saltar al contenido
        </a>

        <Navbar />

        <main id="contenido" className="page-container flex-1 py-8 sm:py-12">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

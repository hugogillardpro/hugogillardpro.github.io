import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/jost';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Consent from '@/components/Consent';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Hugo Gillard, photographe et vidéaste de mariage',
    template: '%s | Hugo Gillard',
  },
  description:
    'Reportages photo et films de mariage en Hainaut, dans le Nord de la France et au-delà, par Hugo Gillard.',
  verification: { google: site.googleSiteVerification },
  icons: { icon: '/favicon.svg' },
  openGraph: { siteName: site.nom, locale: 'fr_BE', type: 'website' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f1e8',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Les apparitions au défilement ne sont activées que si le script tourne : sans lui, tout reste visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="evitement" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}

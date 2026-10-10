import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/jost';
import './globals.css';
import Apparitions from '@/components/Apparitions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Consent from '@/components/Consent';
import { apercu, site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Hugo Gillard, photographe et vidéaste de mariage',
    template: '%s | Hugo Gillard',
  },
  description:
    'Reportages photo et films de mariage partout en Belgique, dans le Nord de la France et au-delà, par Hugo Gillard.',
  verification: { google: site.googleSiteVerification },
  robots: apercu ? { index: false, follow: false } : undefined,
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
      <body>
        <a className="evitement" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <Consent />
        <Apparitions />
      </body>
    </html>
  );
}

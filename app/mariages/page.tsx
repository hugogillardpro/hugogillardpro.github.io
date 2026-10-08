import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import WeddingCard from '@/components/WeddingCard';
import { getMariages } from '@/lib/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mariages',
  description:
    "Les mariages photographiés et filmés par Hugo Gillard, photographe et vidéaste de mariage en Hainaut et dans le Nord de la France. Chaque page suit la journée dans l'ordre.",
  alternates: { canonical: '/mariages/' },
  openGraph: { title: 'Mariages | Hugo Gillard', url: '/mariages/' },
};

export default function PageMariages() {
  const mariages = getMariages();
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Mariages', item: `${site.url}/mariages/` },
    ],
  };

  return (
    <div className="page-interieure">
      <JsonLd data={jsonld} />
      <header className="conteneur tete-page">
        <p className="sur-titre">Portfolio</p>
        <h1>Mariages</h1>
        <p className="chapo">
          Chaque page suit une journée dans l'ordre, des préparatifs à la soirée. Les photos sont choisies dans le
          reportage complet remis aux mariés.
        </p>
      </header>
      <div className="conteneur grille-mariages grille-mariages--page">
        {mariages.map((m, i) => {
          const large = i % 6 === 0;
          return (
            <Reveal key={m.slug} className={large ? 'large' : ''} delay={(i % 3) as 0 | 1 | 2}>
              <WeddingCard mariage={m} large={large} prioritaire={i < 2} />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

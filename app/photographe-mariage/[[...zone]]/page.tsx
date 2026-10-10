import type { Metadata } from 'next';
import Link from 'next/link';
import Contact from '@/components/Contact';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import SectionFormules from '@/components/SectionFormules';
import WeddingCard from '@/components/WeddingCard';
import { site } from '@/lib/site';
import { getZone, getZonesPubliees, type Zone } from '@/lib/zones';

// /photographe-mariage/ : les régions où des mariages sont publiés.
// /photographe-mariage/<zone>/ : la page locale d'une province, seulement si un mariage y est rattaché.
// Tant qu'aucune zone n'a de mariage, l'index existe (l'export statique l'exige) mais n'est ni lié
// ni indexé.
type Params = { zone?: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return [{ zone: [] }, ...getZonesPubliees().map((zn) => ({ zone: [zn.slug] }))];
}

const TITRE_INDEX = 'Photographe et vidéaste de mariage en Belgique et dans le Nord de la France';

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { zone } = await params;
  if (!zone?.length) {
    const vide = getZonesPubliees().length === 0;
    return {
      title: 'Photographe de mariage par région',
      description:
        'Les mariages photographiés et filmés par Hugo Gillard, région par région : Wallonie, Bruxelles et Nord de la France.',
      alternates: { canonical: '/photographe-mariage/' },
      robots: vide ? { index: false, follow: true } : undefined,
    };
  }
  const zn = getZone(zone[0]);
  const titre = `Photographe de mariage ${zn.dans}`;
  const url = `/photographe-mariage/${zn.slug}/`;
  return {
    title: titre,
    description: zn.description,
    alternates: { canonical: url },
    openGraph: { title: `${titre} | Hugo Gillard`, description: zn.description, url, images: [zn.mariages[0].og] },
  };
}

export default async function PagePhotographeMariage({ params }: { params: Promise<Params> }) {
  const { zone } = await params;
  return zone?.length ? <PageZone zn={getZone(zone[0])} /> : <IndexZones zones={getZonesPubliees()} />;
}

function IndexZones({ zones }: { zones: Zone[] }) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Photographe de mariage', item: `${site.url}/photographe-mariage/` },
    ],
  };
  return (
    <div className="page-interieure">
      <JsonLd data={jsonld} />
      <header className="conteneur tete-page tete-page--zone">
        <nav className="ariane" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Photographe de mariage</span>
        </nav>
        <h1>{TITRE_INDEX}</h1>
        <p className="chapo">
          Je photographie et je filme des mariages dans toute la Belgique et le Nord de la France. Voici, région par
          région, des mariages que j'ai couverts.
        </p>
      </header>
      <div className="conteneur zone__mariages">
        {zones.length > 0 && (
          <div className="grille-trois">
            {zones.map((zn) => (
              <Link key={zn.slug} href={`/photographe-mariage/${zn.slug}/`} className="carte">
                <span className="carte__photo" data-apparition="photo">
                  <Photo
                    image={zn.mariages[0].couverture}
                    alt=""
                    className="carte__img"
                    sizes="(min-width: 1440px) 400px, (min-width: 860px) 30vw, 48vw"
                  />
                </span>
                <span className="carte__nom">{zn.nom}</span>
                <span className="carte__meta">
                  {zn.mariages.length} {zn.mariages.length > 1 ? 'mariages' : 'mariage'}
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link href="/mariages/" className="lien">
          Tous les mariages
        </Link>
      </div>
    </div>
  );
}

function PageZone({ zn }: { zn: Zone }) {
  const url = `${site.url}/photographe-mariage/${zn.slug}/`;
  const plusieurs = zn.mariages.length > 1;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Photographe de mariage', item: `${site.url}/photographe-mariage/` },
        { '@type': 'ListItem', position: 3, name: zn.nom, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Photographe et vidéaste de mariage ${zn.dans}`,
      serviceType: 'Photographie et vidéo de mariage',
      url,
      provider: { '@type': 'Person', '@id': `${site.url}/#hugo`, name: site.nom, url: `${site.url}/` },
      areaServed: { '@type': 'AdministrativeArea', name: zn.officiel },
    },
  ];

  return (
    <>
      <div className="page-interieure">
        <JsonLd data={jsonld} />
        <header className="conteneur tete-page tete-page--zone">
          <nav className="ariane" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">›</span>
            <Link href="/photographe-mariage/">Photographe de mariage</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{zn.nom}</span>
          </nav>
          <h1>Photographe et vidéaste de mariage {zn.dans}</h1>
          <p className="chapo">{zn.intro}</p>
        </header>

        <section className="conteneur zone__mariages" aria-labelledby="titre-zone-mariages">
          <h2 id="titre-zone-mariages" className="zone__titre">
            {plusieurs ? `Des mariages ${zn.dans}` : `Un mariage ${zn.dans}`}
          </h2>
          <div className="grille-mariages">
            {zn.mariages.map((m, i) => {
              const large = i % 6 === 0;
              return (
                <div key={m.slug} className={large ? 'large' : undefined}>
                  <WeddingCard mariage={m} large={large} prioritaire={i < 2} />
                </div>
              );
            })}
          </div>
          {zn.texte.length > 0 && (
            <div className="texte zone__texte">
              {zn.texte.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          <Link href="/mariages/" className="lien">
            Tous les mariages
          </Link>
        </section>
      </div>

      <SectionFormules />
      <Contact />
    </>
  );
}

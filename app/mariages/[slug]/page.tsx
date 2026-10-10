import type { Metadata } from 'next';
import Link from 'next/link';
import Couple from '@/components/Couple';
import Film from '@/components/Film';
import Gallery from '@/components/Gallery';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import WeddingCard from '@/components/WeddingCard';
import { chapitres, getMariage, getMariages } from '@/lib/content';
import { dateLongue, de, lieuTexte } from '@/lib/format';
import { img } from '@/lib/images';
import { site } from '@/lib/site';
import { getZonesPubliees } from '@/lib/zones';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getMariages().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMariage(slug);
  const lieu = lieuTexte(m);
  const titre = `Mariage ${de(m.couple)}${lieu ? ` à ${lieu}` : ''}`;
  const description = `Le mariage ${de(m.couple.replace(' & ', ' et '))}${m.date ? ` le ${dateLongue(m.date)}` : ''}${
    lieu ? ` à ${lieu}` : ''
  }, photographié${m.film ? ' et filmé' : ''} par Hugo Gillard : ${m.photos.length + 1} photos, dans l'ordre de la journée.`;
  return {
    title: titre,
    description,
    alternates: { canonical: `/mariages/${slug}/` },
    openGraph: { title: `${titre} | Hugo Gillard`, description, url: `/mariages/${slug}/`, images: [m.og] },
  };
}

export default async function PageMariage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const m = getMariage(slug);
  const tous = getMariages();
  const position = tous.findIndex((x) => x.slug === slug);
  const precedent = tous[position - 1];
  const suivant = tous[position + 1];
  const autres = tous.filter((x) => x.slug !== slug).slice(0, 3);
  const lieu = lieuTexte(m);
  const vignette = m.film ? img(`/img/films/${m.film}`) : null;
  const url = `${site.url}/mariages/${slug}/`;
  const zone = getZonesPubliees().find((z) => z.slug === m.zone);

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Mariages', item: `${site.url}/mariages/` },
        { '@type': 'ListItem', position: 3, name: m.couple, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: `Mariage ${de(m.couple)}`,
      url,
      author: { '@type': 'Person', name: site.nom, url: `${site.url}/` },
      image: {
        '@type': 'ImageObject',
        contentUrl: `${site.url}${m.og}`,
        creator: { '@type': 'Person', name: site.nom },
        creditText: site.nom,
        copyrightNotice: `© ${site.nom}`,
      },
    },
  ];

  return (
    <article>
      <JsonLd data={jsonld} />

      <header className="mariage-hero">
        <div className="hero__photo">
          <Photo image={m.hero} alt={m.heroAlt} className="hero__img" sizes="100vw" loading="eager" fetchPriority="high" />
        </div>
        <div className="conteneur mariage-hero__contenu">
          <p className="fiche">
            <span>{[m.date ? dateLongue(m.date) : 'Mariage', lieu].filter(Boolean).join(', ')}</span>
            <span>{m.film ? 'Photo & film' : 'Photo'}</span>
          </p>
          <h1 className="mariage-hero__titre">
            <Couple nom={m.couple} />
          </h1>
        </div>
      </header>

      <div className="conteneur">
        <nav className="ariane" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">›</span>
          <Link href="/mariages/">Mariages</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{m.couple}</span>
        </nav>
      </div>

      <div className="conteneur intro-mariage">
        <p className="chapo">{m.resume}</p>
        {zone && (
          <Link href={`/photographe-mariage/${zone.slug}/`} className="lien">
            Mes mariages {zone.dans}
          </Link>
        )}
      </div>

      <Gallery chapitres={chapitres(m)} />

      {m.film && vignette && (
        <section className="section section--nuit" aria-labelledby="titre-film">
          <div className="conteneur bande-film">
            <h2 id="titre-film">Le film</h2>
            <Film id={m.film} titre={`Teaser du mariage ${de(m.couple)}`} vignette={vignette} sizes="(min-width: 1200px) 1100px, 94vw" />
          </div>
        </section>
      )}

      {m.temoignage?.verifie && (
        <section className="section" aria-labelledby="titre-mot">
          <div className="conteneur temoignage">
            <h2 id="titre-mot">Le mot des mariés</h2>
            <blockquote>{m.temoignage.texte}</blockquote>
            {m.temoignage.source && <cite>{m.temoignage.source}</cite>}
          </div>
        </section>
      )}

      <section className="section section--creme2" aria-labelledby="titre-suite">
        <div className="conteneur">
          <div className="bande-cta">
            <h2 id="titre-suite">
              Vous vous mariez {m.commune ? `à ${m.commune} ou pas loin` : zone ? zone.dans : 'bientôt'} ?
            </h2>
            <p className="texte">Envoyez-moi votre date et le lieu : je vous dis si je suis libre, et on en parle.</p>
            <Link href="/#contact" className="btn">
              Vérifier ma date
            </Link>
          </div>

          {autres.length > 0 && (
            <>
              <div className="tete-section tete-section--ligne">
                <h2>D'autres mariages</h2>
                <Link href="/mariages/" className="lien">
                  Tous les mariages
                </Link>
              </div>
              <div className="grille-trois">
                {autres.map((x) => (
                  <WeddingCard key={x.slug} mariage={x} />
                ))}
              </div>
            </>
          )}

          <nav className="mariage-nav" aria-label="Mariage précédent ou suivant">
            {precedent && (
              <Link href={`/mariages/${precedent.slug}/`}>
                <span>Mariage plus récent</span>
                <b>
                  <Couple nom={precedent.couple} />
                </b>
              </Link>
            )}
            {suivant && (
              <Link href={`/mariages/${suivant.slug}/`}>
                <span>Mariage plus ancien</span>
                <b>
                  <Couple nom={suivant.couple} />
                </b>
              </Link>
            )}
          </nav>
        </div>
      </section>
    </article>
  );
}

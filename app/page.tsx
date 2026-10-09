import type { Metadata } from 'next';
import Link from 'next/link';
import Contact from '@/components/Contact';
import Couple from '@/components/Couple';
import Film from '@/components/Film';
import HeroVideo from '@/components/HeroVideo';
import { Sceau } from '@/components/Brand';
import JsonLd from '@/components/JsonLd';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';
import WeddingCard from '@/components/WeddingCard';
import { getMariages } from '@/lib/content';
import { de } from '@/lib/format';
import { img } from '@/lib/images';
import { accueil, films, prestations, site } from '@/lib/site';

const titre = 'Hugo Gillard, photographe et vidéaste de mariage en Hainaut et dans le Nord';
const description =
  "Reportages photo et films de mariage en Hainaut, dans le Nord de la France et au-delà. Environ 700 photos retouchées, un teaser et un film d'une dizaine de minutes. Découvrez des mariages complets, dans l'ordre de la journée.";

export const metadata: Metadata = {
  title: { absolute: titre },
  description,
  alternates: { canonical: '/' },
  openGraph: { title: titre, description, url: '/', images: [`/img/${accueil.mariageEnUne}/og.jpg`] },
};

export default function Accueil() {
  const mariages = getMariages();
  const recents = mariages.slice(0, 5);
  const grande = img(accueil.apropos.grande);
  const petite = img(accueil.apropos.petite);
  const vignettes = new Map(films.map((f) => [f.id, img(`/img/films/${f.id}`)]));

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${site.url}/#site`, url: `${site.url}/`, name: site.nom, inLanguage: 'fr' },
      {
        '@type': 'Person',
        '@id': `${site.url}/#hugo`,
        name: site.nom,
        jobTitle: site.metier,
        url: `${site.url}/`,
        email: site.email,
        telephone: site.telephone,
        sameAs: [site.instagram, site.facebook],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonld} />

      <section className="hero" aria-label="Présentation">
        <HeroVideo
          src={accueil.video.src}
          affiche={img(accueil.video.affiche)}
          alt={`Extrait du film du mariage ${de(accueil.video.couple)}`}
        />
        <div className="conteneur hero__contenu">
          <Sceau className="hero__sceau" texte="var(--nuit-texte)" or="var(--or-clair)" />
          <h1 className="hero__titre">Photographe et vidéaste de mariage</h1>
          <p className="hero__sous">Du Hainaut au Nord de la France, et partout où vous m'emmènerez.</p>
          <div className="hero__actions">
            <Link href="/mariages/" className="btn btn--clair">
              Voir les mariages
            </Link>
            <Link href="/#contact" className="btn btn--contour-clair">
              Vérifier ma date
            </Link>
          </div>
        </div>
        <p className="hero__legende">
          Film : <Link href={`/mariages/${accueil.video.mariage}/`}>{accueil.video.couple}</Link>
        </p>
      </section>

      <section className="section" id="approche" aria-labelledby="titre-approche">
        <div className="conteneur apropos">
          <div className="apropos__visuel">
            <Photo image={grande} alt="" className="apropos__grande" sizes="(min-width: 1000px) 36vw, 100vw" />
            <Photo image={petite} alt="" className="apropos__petite" sizes="(min-width: 1000px) 20vw, 54vw" />
          </div>
          <div className="apropos__texte">
            <h2 id="titre-approche">Vous vivez votre journée. Je m'occupe du reste.</h2>
            <div className="texte">
              <p>
                Je m'appelle Hugo Gillard. Je photographie et je filme des mariages en Belgique et dans le Nord de la
                France, des préparatifs jusqu'à la pièce montée.
              </p>
              <p>
                Le jour J, je reste en retrait. Je photographie ce qui se passe, et je ne vous emprunte que le temps de
                quelques portraits. Le film reprend la journée sur une musique que nous choisissons ensemble.
              </p>
            </div>
            <Link href="/#prestations" className="lien">
              Découvrir les prestations
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--serre" id="mariages" aria-labelledby="titre-mariages">
        <div className="conteneur">
          <div className="tete-section tete-section--ligne">
            <h2 id="titre-mariages">Des mariages, racontés dans l'ordre de la journée</h2>
            <Link href="/mariages/" className="lien">
              Tous les mariages
            </Link>
          </div>
          <div className="grille-mariages">
            {recents.map((m, i) => (
              <Reveal key={m.slug} className={i === 0 ? 'large' : ''} delay={(i % 3) as 0 | 1 | 2}>
                <WeddingCard mariage={m} large={i === 0} prioritaire={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--nuit" id="films" aria-labelledby="titre-films">
        <div className="conteneur">
          <div className="tete-section">
            <h2 id="titre-films">Le film de votre mariage</h2>
            <p className="chapo chapo--nuit">
              Les teasers de quatre mariages. Le film complet dure une dizaine de minutes, sur une musique que nous
              choisissons ensemble.
            </p>
          </div>
          <div className="films">
            {films.map((f) => (
              <div key={f.id} className="film">
                <Film id={f.id} titre={`Teaser du mariage ${de(f.couple)}`} vignette={vignettes.get(f.id)!} />
                <p className="film__titre">
                  {f.mariage ? (
                    <Link href={`/mariages/${f.mariage}/`} className="lien-discret">
                      <Couple nom={f.couple} />
                    </Link>
                  ) : (
                    <Couple nom={f.couple} />
                  )}
                </p>
                <p className="film__sous">Teaser de 30 secondes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--creme2" id="prestations" aria-labelledby="titre-prestations">
        <div className="conteneur prestations">
          <div className="prestations__tete">
            <h2 id="titre-prestations">Photo, film, ou les deux</h2>
            <p className="chapo">
              Je couvre la journée des préparatifs jusqu'à la pièce montée. Le tarif dépend de la formule et du lieu.
            </p>
            <Link href="/#contact" className="btn">
              Vérifier ma date
            </Link>
          </div>
          <ul className="formules">
            {prestations.map((p) => (
              <li key={p.nom} className="formule">
                <h3 className="formule__nom">{p.nom}</h3>
                <div className="formule__detail">
                  <p>{p.description}</p>
                  <ul className="formule__inclus">
                    {p.inclus.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <p className="formule__prix">
                  <span>{p.prix ? 'À partir de' : 'Tarif'}</span>
                  {p.prix ?? 'Sur demande'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact />
    </>
  );
}

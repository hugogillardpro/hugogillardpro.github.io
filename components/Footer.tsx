import Link from 'next/link';
import BoutonCookies from './BoutonCookies';
import { Sceau } from './Brand';
import Reseaux from './Reseaux';
import { site } from '@/lib/site';
import { getZonesPubliees } from '@/lib/zones';

export default function Footer() {
  const annee = new Date().getFullYear();
  const zones = getZonesPubliees();
  return (
    <footer className="pied">
      <div className="conteneur pied__corps">
        <Link href="/" className="pied__marque" aria-label="Hugo Gillard, retour à l'accueil">
          <Sceau className="pied__sceau" />
        </Link>
        <p className="pied__phrase">
          Photographe et vidéaste de mariage. {site.zones}, et ailleurs sur demande.
        </p>
        <nav aria-label="Pied de page">
          <ul className="pied__liens">
            <li>
              <Link href="/mariages/">Mariages</Link>
            </li>
            <li>
              <Link href="/#films">Films</Link>
            </li>
            <li>
              <Link href="/#prestations">Prestations</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </nav>
        {zones.length > 0 && (
          <nav className="pied__regions" aria-label="Photographe de mariage par région">
            <Link href="/photographe-mariage/">Photographe de mariage</Link>
            <ul>
              {zones.map((z) => (
                <li key={z.slug}>
                  <Link href={`/photographe-mariage/${z.slug}/`}>{z.nom}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <ul className="pied__contact">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={`tel:${site.telephone}`}>{site.telephoneAffiche}</a>
          </li>
        </ul>
        <Reseaux />
        <div className="pied__bas">
          <p>
            © {annee} {site.nom}. Photos et films : tous droits réservés.
          </p>
          <ul>
            <li>
              <Link href="/mentions-legales/">Mentions légales</Link>
            </li>
            <li>
              <Link href="/confidentialite/">Confidentialité</Link>
            </li>
            <li>
              <BoutonCookies />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

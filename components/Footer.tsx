import Link from 'next/link';
import BoutonCookies from './BoutonCookies';
import { Sceau } from './Brand';
import { site } from '@/lib/site';

export default function Footer() {
  const annee = new Date().getFullYear();
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
        <ul className="pied__contact">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={`tel:${site.telephone}`}>{site.telephoneAffiche}</a>
          </li>
          <li>
            <a href={site.instagram} rel="noopener">
              Instagram
            </a>
          </li>
          <li>
            <a href={site.facebook} rel="noopener">
              Facebook
            </a>
          </li>
        </ul>
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

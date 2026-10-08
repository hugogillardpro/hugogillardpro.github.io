import Link from 'next/link';
import BoutonCookies from './BoutonCookies';
import { site } from '@/lib/site';

export default function Footer() {
  const annee = new Date().getFullYear();
  return (
    <footer className="pied">
      <div className="conteneur">
        <div className="pied__grille">
          <div>
            <p className="pied__nom">Hugo Gillard</p>
            <p className="pied__sous">Photographe &amp; vidéaste de mariage</p>
            <p className="pied__zones">{site.zones}, et ailleurs sur demande.</p>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
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
          </div>
          <div>
            <h3>Le site</h3>
            <ul>
              <li>
                <Link href="/mariages/">Tous les mariages</Link>
              </li>
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
        <div className="pied__bas">
          <p>
            © {annee} {site.nom}. Photos et films : tous droits réservés.
          </p>
          <p>{site.metier}</p>
        </div>
      </div>
    </footer>
  );
}

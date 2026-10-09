import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Informations légales sur l'éditeur et l'hébergeur de hugogillardpro.com.",
  alternates: { canonical: '/mentions-legales/' },
};

export default function MentionsLegales() {
  const lignes = [
    ['Nom', site.legal.denomination ?? site.nom],
    ['Adresse', site.legal.adresse],
    ["Numéro d'entreprise (BCE)", site.legal.bce],
    ['Numéro de TVA', site.legal.tva],
  ].filter((l): l is [string, string] => Boolean(l[1]));

  return (
    <div className="page-interieure">
      <article className="conteneur page-texte">
        <h1>Mentions légales</h1>
        <div className="prose">
          <h2>Éditeur du site</h2>
          <dl>
            {lignes.map(([cle, valeur]) => (
              <div key={cle}>
                <dt>{cle}</dt>
                <dd>{valeur}</dd>
              </div>
            ))}
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${site.telephone}`}>{site.telephoneAffiche}</a>
              </dd>
            </div>
          </dl>

          <h2>Hébergement</h2>
          <p>GitHub Pages, GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p>

          <h2>Photos et films</h2>
          <p>
            Les photos et les films publiés sur ce site sont l'œuvre de {site.nom}. Toute reproduction demande son
            accord écrit.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Voir la page <Link href="/confidentialite/">Confidentialité et cookies</Link>.
          </p>
        </div>
      </article>
    </div>
  );
}

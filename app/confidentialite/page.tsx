import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Confidentialité et cookies',
  description:
    'Ce que deviennent les données envoyées par le formulaire de contact, et les cookies utilisés sur hugogillardpro.com.',
  alternates: { canonical: '/confidentialite/' },
};

export default function Confidentialite() {
  return (
    <div className="page-interieure">
      <article className="conteneur page-texte">
        <h1>Confidentialité et cookies</h1>
        <div className="prose">
          <h2>Qui est responsable</h2>
          <p>
            {site.nom}
            {site.legal.adresse ? `, ${site.legal.adresse}` : ''}. Pour toute question sur vos données :{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Le formulaire de contact</h2>
          <p>
            Quand vous m'écrivez par le formulaire, je reçois votre prénom, votre nom, votre adresse e-mail et, si vous
            les indiquez, votre téléphone, la date et le lieu du mariage, la formule qui vous intéresse et votre message.
          </p>
          <p>
            Ces données servent uniquement à vous répondre et à préparer un devis, à votre demande (article 6.1.b du
            RGPD). Je les conserve {site.conservation}. Je ne les vends pas et je ne les utilise pas pour de la
            prospection.
          </p>
          <p>
            Le formulaire passe par Formspree, un service établi aux États-Unis, qui me transmet votre message par
            e-mail.
          </p>

          <h2>Cookies et traceurs</h2>
          <p>
            Le site ne dépose aucun cookie à l'ouverture. Il enregistre seulement, dans votre navigateur, votre choix sur
            le bandeau des cookies.
          </p>
          <p>
            Si vous cliquez sur « Accepter », le site charge le traceur Google Ads. Il me permet de savoir si une demande
            de contact vient d'une annonce. Si vous refusez, il ne se charge pas. Vous pouvez changer d'avis à tout moment
            avec le bouton « Gérer les cookies » en bas de chaque page.
          </p>
          <p>
            Les films sont hébergés sur YouTube. Ils ne se chargent que si vous cliquez sur l'un d'eux, en mode de
            confidentialité renforcée (youtube-nocookie.com).
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par GitHub Pages (GitHub, États-Unis), qui peut enregistrer l'adresse IP des visiteurs
            dans ses journaux techniques. Les polices de caractères sont hébergées sur le site lui-même.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous pouvez demander à consulter, corriger ou effacer vos données, vous opposer à leur utilisation ou en
            demander une copie, en m'écrivant à <a href={`mailto:${site.email}`}>{site.email}</a>. Vous pouvez aussi
            introduire une réclamation auprès de l'Autorité de protection des données (
            <a href="https://www.autoriteprotectiondonnees.be" rel="noopener">
              autoriteprotectiondonnees.be
            </a>
            ).
          </p>
        </div>
      </article>
    </div>
  );
}

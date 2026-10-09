'use client';

import { CaretDown } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { prestations, site } from '@/lib/site';

export default function ContactForm() {
  const [statut, setStatut] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  async function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setEnvoi(true);
    setStatut('Envoi en cours…');
    try {
      const reponse = await fetch(site.formspree, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      // Conversion Google Ads, seulement si le visiteur a accepté le traceur.
      if (window.hgConsentement?.() && window.gtag) {
        window.gtag('event', 'conversion', { send_to: site.googleAds.conversion, value: 1.0, currency: 'EUR' });
      }
      setEnvoye(true);
    } catch {
      setStatut(`L'envoi n'a pas abouti. Réessayez, ou écrivez-moi directement à ${site.email}.`);
      setEnvoi(false);
    }
  }

  if (envoye) {
    return (
      <div className="merci" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <h3>Message bien reçu</h3>
        <p className="texte">
          Je vous réponds {site.delaiReponse}. Si c'est urgent, appelez-moi au{' '}
          <a href={`tel:${site.telephone}`}>{site.telephoneAffiche}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="formulaire" action={site.formspree} method="POST" onSubmit={soumettre} noValidate>
      <p className="formulaire__piege" aria-hidden="true">
        <label>
          Ne pas remplir <input name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="formulaire__ligne">
        <div className="champ">
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" autoComplete="given-name" required />
        </div>
        <div className="champ">
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" autoComplete="family-name" required />
        </div>
      </div>
      <div className="formulaire__ligne">
        <div className="champ">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="champ">
          <label htmlFor="telephone">
            Téléphone <small>(facultatif)</small>
          </label>
          <input id="telephone" name="telephone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="formulaire__ligne">
        <div className="champ">
          <label htmlFor="date">Date du mariage</label>
          <input id="date" name="date" type="date" />
        </div>
        <div className="champ">
          <label htmlFor="lieu">Lieu (commune ou salle)</label>
          <input id="lieu" name="lieu" type="text" />
        </div>
      </div>
      <div className="champ">
        <label htmlFor="prestation">Ce qui vous intéresse</label>
        <div className="champ__select">
          <select id="prestation" name="prestation" defaultValue="">
            <option value="">Je ne sais pas encore</option>
            {prestations.map((p) => (
              <option key={p.nom} value={p.nom}>
                {p.nom}
              </option>
            ))}
          </select>
          <CaretDown size={16} weight="regular" aria-hidden="true" />
        </div>
      </div>
      <div className="champ">
        <label htmlFor="message">Votre message</label>
        <textarea id="message" name="message" rows={5} />
      </div>
      <p className="formulaire__rgpd">
        Vos coordonnées servent uniquement à répondre à votre demande. Elles transitent par le service Formspree, aux
        États-Unis. <Link href="/confidentialite/">Confidentialité</Link>
      </p>
      <div className="formulaire__envoi">
        <button type="submit" className="btn" disabled={envoi}>
          Envoyer
        </button>
        <p className="formulaire__statut" role="status" aria-live="polite">
          {statut}
        </p>
      </div>
    </form>
  );
}

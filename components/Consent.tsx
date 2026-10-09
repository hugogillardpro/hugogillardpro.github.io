'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

const CLE = 'hg-consentement';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    hgConsentement?: () => boolean;
  }
}

const REFUSE = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

function lire(): string | null {
  try {
    return localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

function ecrire(valeur: string) {
  try {
    localStorage.setItem(CLE, valeur);
  } catch {
    // stockage indisponible : le choix vaut pour cette page
  }
}

let charge = false;

// Google Ads n'est chargé qu'après acceptation (mode de consentement v2, variante « de base »).
function chargerGoogleAds() {
  if (charge) return;
  charge = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as Window['gtag'];
  window.gtag!('consent', 'default', REFUSE);
  window.gtag!('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${site.googleAds.id}`;
  document.head.appendChild(s);
  window.gtag!('js', new Date());
  window.gtag!('config', site.googleAds.id);
}

export default function Consent() {
  const [visible, setVisible] = useState(false);
  // Au premier passage, le bandeau monte un peu après l'ouverture de la page ;
  // rouvert depuis « Gérer les cookies », il monte tout de suite.
  const [differe, setDiffere] = useState(false);
  const [sortie, setSortie] = useState(false);

  useEffect(() => {
    window.hgConsentement = () => lire() === 'accepte';
    const choix = lire();
    if (choix === 'accepte') chargerGoogleAds();
    else if (choix !== 'refuse') {
      setDiffere(true);
      setVisible(true);
    }
    const ouvrir = () => {
      setDiffere(false);
      setSortie(false);
      setVisible(true);
    };
    window.addEventListener('hg:consentement', ouvrir);
    return () => window.removeEventListener('hg:consentement', ouvrir);
  }, []);

  function choisir(valeur: 'accepte' | 'refuse') {
    ecrire(valeur);
    // Il redescend par où il est arrivé, puis disparaît.
    setSortie(true);
    window.setTimeout(() => setVisible(false), 260);
    if (valeur === 'accepte') chargerGoogleAds();
    else window.gtag?.('consent', 'update', REFUSE);
  }

  if (!visible) return null;
  return (
    <div
      className={['consentement', differe && 'consentement--differe', sortie && 'consentement--sortie'].filter(Boolean).join(' ')}
      role="region"
      aria-label="Cookies"
    >
      <div className="conteneur consentement__interieur">
        <p>
          J'utilise un traceur Google Ads pour savoir quelles annonces amènent des demandes de contact. Il ne se charge
          que si vous l'acceptez. <Link href="/confidentialite/">En savoir plus</Link>
        </p>
        <div className="consentement__choix">
          <button type="button" className="btn btn--contour" onClick={() => choisir('refuse')}>
            Refuser
          </button>
          <button type="button" className="btn" onClick={() => choisir('accepte')}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

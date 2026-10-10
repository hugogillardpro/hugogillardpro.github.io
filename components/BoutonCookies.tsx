'use client';

import { apercu } from '@/lib/site';

// Rouvre le bandeau des cookies (écouté par components/Consent.tsx).
export default function BoutonCookies() {
  if (apercu) return null;
  return (
    <button
      type="button"
      className="lien-bouton"
      onClick={() => window.dispatchEvent(new Event('hg:consentement'))}
    >
      Gérer les cookies
    </button>
  );
}

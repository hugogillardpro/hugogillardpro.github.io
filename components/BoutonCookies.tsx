'use client';

// Rouvre le bandeau des cookies (écouté par components/Consent.tsx).
export default function BoutonCookies() {
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

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="page-interieure">
      <section className="conteneur page-texte">
        <p className="sur-titre">Erreur 404</p>
        <h1>Cette page n'existe pas</h1>
        <p className="prose">Elle a peut-être été déplacée. Vous pouvez repartir de l'accueil ou parcourir les mariages.</p>
        <p style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" className="btn">
            Accueil
          </Link>
          <Link href="/mariages/" className="lien">
            Tous les mariages
          </Link>
        </p>
      </section>
    </div>
  );
}

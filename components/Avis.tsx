import Link from 'next/link';
import Couple from './Couple';
import { getAvis } from '@/lib/avis';
import { dateMois, majuscule } from '@/lib/format';

// « Le mot des mariés » sur l'accueil : seulement les avis vérifiés. Sans avis vérifié, pas de section.
export default function Avis() {
  const avis = getAvis();
  if (avis.length === 0) return null;
  return (
    <section className="section avis" aria-labelledby="titre-avis">
      <div className="conteneur">
        <div className="tete-section">
          <h2 id="titre-avis">Le mot des mariés</h2>
        </div>
        <ul className="avis__liste" data-colonnes={avis.length % 3 === 0 ? 3 : 2}>
          {avis.map((a) => (
            <li key={a.couple} className="avis__item">
              <blockquote className="avis__texte">{a.texte}</blockquote>
              <p className="avis__couple">
                <Couple nom={a.couple} />
              </p>
              <p className="avis__meta">
                {[a.date && majuscule(dateMois(a.date)), a.lieu, a.source].filter(Boolean).join(', ')}
              </p>
              {a.mariage && (
                <Link href={`/mariages/${a.mariage}/`} className="lien">
                  Voir leur mariage
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

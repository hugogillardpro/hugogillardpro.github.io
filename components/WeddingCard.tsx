import Link from 'next/link';
import Couple from './Couple';
import Photo from './Photo';
import type { Mariage } from '@/lib/content';
import { dateMois, lieuTexte, majuscule } from '@/lib/format';

export default function WeddingCard({
  mariage: m,
  large = false,
  prioritaire = false,
}: {
  mariage: Mariage;
  large?: boolean;
  prioritaire?: boolean;
}) {
  const meta = [majuscule(dateMois(m.date)), lieuTexte(m), m.film ? 'Photo & film' : 'Photo']
    .filter(Boolean)
    .join(' · ');
  return (
    <Link href={`/mariages/${m.slug}/`} className={`carte ${large ? 'carte--large' : ''}`}>
      <span className="carte__photo" data-apparition="photo">
        <Photo
          image={large ? m.hero : m.couverture}
          alt=""
          className="carte__img"
          sizes={
            large
              ? '(min-width: 1440px) 830px, (min-width: 860px) 62vw, 100vw'
              : '(min-width: 1440px) 400px, (min-width: 860px) 30vw, 48vw'
          }
          loading={prioritaire ? 'eager' : 'lazy'}
        />
      </span>
      <span className="carte__nom">
        <Couple nom={m.couple} />
      </span>
      <span className="carte__meta">{meta}</span>
    </Link>
  );
}

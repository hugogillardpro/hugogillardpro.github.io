'use client';

import { Play } from '@phosphor-icons/react/ssr';
import { useState } from 'react';
import Photo from './Photo';
import type { Img } from '@/lib/images';

// Vignette locale, lecteur YouTube chargé seulement au clic, en mode confidentialité renforcée.
export default function Film({
  id,
  titre,
  vignette,
  sizes = '(min-width: 1440px) 640px, (min-width: 760px) 46vw, 100vw',
}: {
  id: string;
  titre: string;
  vignette: Img;
  sizes?: string;
}) {
  const [actif, setActif] = useState(false);
  return (
    <div className="film__cadre" data-apparition="photo">
      {actif ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={titre}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="film__bouton" onClick={() => setActif(true)} aria-label={`Lire : ${titre}`}>
          <Photo image={vignette} alt="" className="film__img" sizes={sizes} loading="lazy" />
          <span className="film__play" aria-hidden="true">
            <Play size={24} weight="fill" />
          </span>
        </button>
      )}
    </div>
  );
}

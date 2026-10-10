'use client';

import { CaretLeft, CaretRight, X } from '@phosphor-icons/react/ssr';
import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import type { Img } from '@/lib/images';

export type PhotoItem = { image: Img; alt: string; chapitre: string };
type Chapitre = { titre: string; photos: PhotoItem[] };
type Rangee = { type: 'large' | 'paire' | 'seule'; photos: PhotoItem[] };
// Comment la photo affichée est arrivée : elle glisse dans le sens du geste (clic ou balayage),
// mais change sans animation au clavier, où l'on enchaîne les photos vite.
type Entree = 'ouverture' | 'suivante' | 'precedente' | 'aucune';

// Une horizontale prend toute la largeur ; deux verticales qui se suivent vont côte à côte.
function rangees(photos: PhotoItem[]): Rangee[] {
  const out: Rangee[] = [];
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const suivante = photos[i + 1];
    const horizontale = p.image.width >= p.image.height;
    if (horizontale) out.push({ type: 'large', photos: [p] });
    else if (suivante && suivante.image.width < suivante.image.height) {
      out.push({ type: 'paire', photos: [p, suivante] });
      i++;
    } else out.push({ type: 'seule', photos: [p] });
  }
  return out;
}

const TAILLES = {
  large: '(min-width: 1440px) 1256px, 90vw',
  paire: '(min-width: 1440px) 614px, (min-width: 700px) 44vw, 90vw',
  seule: '(min-width: 1440px) 780px, (min-width: 700px) 56vw, 90vw',
};

export default function Gallery({ chapitres }: { chapitres: Chapitre[] }) {
  const toutes = chapitres.flatMap((c) => c.photos);
  const [index, setIndex] = useState<number | null>(null);
  const [entree, setEntree] = useState<Entree>('ouverture');
  const dialog = useRef<HTMLDialogElement>(null);
  const toucheX = useRef<number | null>(null);

  // Fermeture par Échap ou par le navigateur : écoutée directement sur l'élément.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const surFermeture = () => setIndex(null);
    d.addEventListener('close', surFermeture);
    return () => d.removeEventListener('close', surFermeture);
  }, []);

  const ouvrir = (i: number) => {
    setEntree('ouverture');
    setIndex(i);
  };
  const suivante = (anime = true) => {
    setEntree(anime ? 'suivante' : 'aucune');
    setIndex((i) => (i === null ? null : (i + 1) % toutes.length));
  };
  const precedente = (anime = true) => {
    setEntree(anime ? 'precedente' : 'aucune');
    setIndex((i) => (i === null ? null : (i - 1 + toutes.length) % toutes.length));
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = 'hidden';
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') suivante(false);
      if (e.key === 'ArrowLeft') precedente(false);
    };
    window.addEventListener('keydown', touche);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', touche);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null]);

  let n = 0;
  const actuelle = index === null ? null : toutes[index];

  return (
    <>
      <div className="galerie">
      {chapitres.map((c) => (
        <section key={c.titre} className="chapitre" aria-label={c.titre}>
          <div className="conteneur">
            <h2 className="chapitre__titre">{c.titre}</h2>
            <div className="rangees">
              {rangees(c.photos).map((r, ri) => (
                <div key={ri} className={`rangee rangee--${r.type}`}>
                  {r.photos.map((p) => {
                    const i = n++;
                    return (
                      <figure key={p.image.id} data-apparition="photo">
                        <button
                          type="button"
                          className="photo-bouton"
                          onClick={() => ouvrir(i)}
                          aria-label={`Agrandir : ${p.alt}`}
                        >
                          <Photo image={p.image} alt={p.alt} sizes={TAILLES[r.type]} loading="lazy" />
                        </button>
                      </figure>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      </div>

      <dialog ref={dialog} className="visionneuse" aria-label="Photo en grand">
        {actuelle && index !== null && (
          <div
            className="visionneuse__corps"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIndex(null);
            }}
            onTouchStart={(e) => {
              toucheX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const depart = toucheX.current;
              const fin = e.changedTouches[0]?.clientX;
              toucheX.current = null;
              if (depart === null || fin === undefined) return;
              if (fin - depart > 50) precedente();
              if (depart - fin > 50) suivante();
            }}
          >
            <div className="visionneuse__image" data-entree={entree}>
              <Photo key={actuelle.image.id} image={actuelle.image} alt={actuelle.alt} className="visionneuse__img" sizes="100vw" />
            </div>
            <div className="visionneuse__pied">
              <p className="visionneuse__legende">{actuelle.alt}</p>
              <p className="visionneuse__compteur">
                {index + 1} / {toutes.length}
              </p>
            </div>
            <button type="button" className="visionneuse__fermer" onClick={() => setIndex(null)} aria-label="Fermer">
              <X size={20} weight="light" aria-hidden="true" />
            </button>
            {toutes.length > 1 && (
              <>
                <button type="button" className="visionneuse__prec" onClick={() => precedente()} aria-label="Photo précédente">
                  <CaretLeft size={20} weight="light" aria-hidden="true" />
                </button>
                <button type="button" className="visionneuse__suiv" onClick={() => suivante()} aria-label="Photo suivante">
                  <CaretRight size={20} weight="light" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

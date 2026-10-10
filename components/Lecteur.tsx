'use client';

import { X } from '@phosphor-icons/react/ssr';
import { useEffect, useRef } from 'react';

export type FilmOuvert = { id: string; titre: string };

// Lecteur YouTube en fenêtre, par-dessus la page (exemples des formules). Le lecteur n'est chargé
// qu'à l'ouverture, en mode confidentialité renforcée, comme les autres films du site.
export default function Lecteur({ film, onFermer }: { film: FilmOuvert | null; onFermer: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fermer = useRef(onFermer);
  fermer.current = onFermer;

  // Fermeture par Échap ou par le navigateur : écoutée directement sur l'élément.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const surFermeture = () => fermer.current();
    d.addEventListener('close', surFermeture);
    return () => d.removeEventListener('close', surFermeture);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (film && !d.open) d.showModal();
    if (!film && d.open) d.close();
    if (!film) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [film]);

  return (
    <dialog ref={dialog} className="lecteur" aria-label={film?.titre}>
      {film && (
        <div
          className="lecteur__corps"
          onClick={(e) => {
            if (e.target === e.currentTarget) onFermer();
          }}
        >
          {/* Le bouton vient en premier : il reçoit le focus à l'ouverture, et Échap reste dans la page
              au lieu de partir dans le lecteur YouTube. */}
          <button type="button" className="visionneuse__fermer" onClick={onFermer} aria-label="Fermer le film">
            <X size={20} weight="light" aria-hidden="true" />
          </button>
          <div className="lecteur__cadre">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0`}
              title={film.titre}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

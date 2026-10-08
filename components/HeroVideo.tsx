'use client';

import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import type { Img } from '@/lib/images';

// Ouverture de l'accueil : l'affiche s'affiche tout de suite (c'est elle qui compte pour la vitesse),
// puis la vidéo se charge sur les écrans larges, sauf si le visiteur économise ses données
// ou a demandé moins d'animations. Un bouton permet de la mettre en pause.
export default function HeroVideo({ src, affiche, alt }: { src: string; affiche: Img; alt: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const large = window.matchMedia('(min-width: 768px)').matches;
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economie = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!large || calme || economie) return;
    const lancer = () => setActive(true);
    if (document.readyState === 'complete') lancer();
    else window.addEventListener('load', lancer, { once: true });
    return () => window.removeEventListener('load', lancer);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!active || !v) return;
    v.play().catch(() => setActive(false));
  }, [active]);

  function basculer() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPause(false);
    } else {
      v.pause();
      setPause(true);
    }
  }

  return (
    <div className="hero__photo">
      <Photo
        image={affiche}
        alt={alt}
        className="hero__img hero__affiche"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />
      {active && (
        <video
          ref={video}
          className={`hero__video ${visible ? 'est-visible' : ''}`}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setVisible(true)}
        />
      )}
      {active && visible && (
        <button type="button" className="hero__pause" onClick={basculer} aria-label={pause ? 'Relancer la vidéo' : 'Mettre la vidéo en pause'}>
          {pause ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3.5 2v10l8-5z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 2h3v10H3zM8 2h3v10H8z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

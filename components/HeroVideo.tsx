'use client';

import { Pause, Play } from '@phosphor-icons/react/ssr';
import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import type { Img } from '@/lib/images';

// Ouverture de l'accueil : l'affiche s'affiche tout de suite (c'est elle qui compte pour la vitesse),
// puis la vidéo se charge une fois la page prête, sauf si le visiteur économise ses données
// ou a demandé moins d'animations. Les écrans en hauteur (téléphones) reçoivent la version
// recadrée en 9:16. Un bouton permet de la mettre en pause.
export default function HeroVideo({
  src,
  srcVertical,
  affiche,
  alt,
}: {
  src: string;
  srcVertical: string;
  affiche: Img;
  alt: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economie = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calme || economie) return;
    const enHauteur = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    const lancer = () => setActive(enHauteur ? srcVertical : src);
    if (document.readyState === 'complete') lancer();
    else window.addEventListener('load', lancer, { once: true });
    return () => window.removeEventListener('load', lancer);
  }, [src, srcVertical]);

  useEffect(() => {
    const v = video.current;
    if (!active || !v) return;
    // Lecture automatique refusée (mode économie d'énergie sur iPhone, par exemple) : l'affiche reste.
    v.play().catch(() => setActive(null));
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
          src={active}
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
          {pause ? <Play size={14} weight="fill" aria-hidden="true" /> : <Pause size={14} weight="fill" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

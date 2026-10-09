'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Les photos se découvrent et les filets se tracent quand ils arrivent à l'écran, une seule fois,
// comme le sceau qui s'écrit à l'ouverture. Repère : l'attribut data-apparition (photo, fondu, filets).
// Ce qui est déjà à l'écran au chargement ne bouge pas : rien n'est masqué avant que le script tourne,
// et sans script (ou avec « réduire les animations ») tout reste simplement visible.
export default function Apparitions() {
  const pathname = usePathname();

  useEffect(() => {
    // Tout ce qui n'est pas encore apparu, y compris ce qu'un passage précédent a mis en attente.
    const elements = [...document.querySelectorAll<HTMLElement>("[data-apparition]:not([data-etat='visible'])")];
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calme || !('IntersectionObserver' in window)) {
      for (const el of elements) el.dataset.etat = 'visible';
      return;
    }

    const io = new IntersectionObserver(
      (entrees) => {
        // Ce qui entre ensemble (une rangée de cartes) se découvre en léger décalé.
        let rang = 0;
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.style.setProperty('--retard', `${rang++ * 90}ms`);
          el.dataset.etat = 'visible';
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    for (const el of elements) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.dataset.etat = 'visible';
        continue;
      }
      el.dataset.etat = 'attente';
      io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

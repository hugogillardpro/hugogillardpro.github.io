'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import Photo from './Photo';
import type { Img } from '@/lib/images';
import type { Prestation } from '@/lib/site';

export type Formule = Omit<Prestation, 'image'> & { image: Img };

// Les trois formules, toujours lisibles en entier. Sur ordinateur, la photo de gauche suit la formule
// survolée (ou touchée) et un repère doré glisse jusqu'à elle. Sur mobile, chaque formule a sa photo.
export default function Prestations({ formules }: { formules: Formule[] }) {
  const [actif, setActif] = useState(0);
  const liste = useRef<HTMLOListElement>(null);
  const repere = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ol = liste.current;
    const r = repere.current;
    if (!ol || !r) return;
    const placer = () => {
      const li = ol.children[actif] as HTMLElement | undefined;
      if (!li) return;
      r.style.transform = `translateY(${li.offsetTop}px) scaleY(${li.offsetHeight})`;
      // Première pose sans animation : le repère n'arrive pas du haut de la liste.
      if (r.dataset.pret === undefined) requestAnimationFrame(() => (r.dataset.pret = ''));
    };
    placer();
    const ro = new ResizeObserver(placer);
    ro.observe(ol);
    for (const li of ol.children) ro.observe(li);
    return () => ro.disconnect();
  }, [actif]);

  return (
    <div className="formules">
      <div className="formules__visuel" aria-hidden="true" data-apparition="photo">
        <div className="formules__pile">
          {formules.map((f, i) => (
            <Photo
              key={f.nom}
              image={f.image}
              alt=""
              className="formules__img"
              sizes="(min-width: 1440px) 560px, 40vw"
              data-actif={i === actif ? '' : undefined}
            />
          ))}
        </div>
      </div>
      <div className="formules__droite">
        <div className="formules__cadre">
          <span ref={repere} className="formules__repere" aria-hidden="true" />
          <ol ref={liste} className="formules__liste" data-apparition="filets">
            {formules.map((f, i) => (
              <li
                key={f.nom}
                className="formule"
                data-actif={i === actif ? '' : undefined}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActif(i)}
                onClick={() => setActif(i)}
              >
                <span className="formule__photo" data-apparition="photo">
                  <Photo image={f.image} alt={f.alt} sizes="100vw" />
                </span>
                <div className="formule__tete">
                  <h3 className="formule__nom">{f.nom}</h3>
                  {f.note && <span className="formule__note">{f.note}</span>}
                </div>
                <p className="formule__description">{f.description}</p>
                <ul className="formule__inclus">
                  {f.inclus.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                {f.prix && <p className="formule__prix">À partir de {f.prix}</p>}
              </li>
            ))}
          </ol>
        </div>
        <Link href="/#contact" className="btn">
          Vérifier ma date
        </Link>
      </div>
    </div>
  );
}

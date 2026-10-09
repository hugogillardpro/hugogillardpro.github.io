import { useId, type CSSProperties } from 'react';
import { LOGOTYPE, MENTION, MONO, SCEAU } from '@/lib/brand';

// Marque d'Hugo Gillard, dessinée à partir de Playfair Display et Jost (voir scripts/logo.py).
// Couleurs : --marque-texte (H, nom) et --marque-or (G, filets), héritées du parent ou passées en props.

type Couleurs = { texte?: string; or?: string };

const vb = (v: readonly number[]) => v.join(' ');
const style = ({ texte, or }: Couleurs): CSSProperties =>
  ({ ...(texte && { '--marque-texte': texte }), ...(or && { '--marque-or': or }) }) as CSSProperties;

// H et G entrelacés : la barre du H passe sur la boucle du G, le G passe devant le jambage.
function Entrelacs({ id }: { id: string }) {
  const [y, h] = MONO.bande;
  return (
    <>
      <defs>
        <clipPath id={`${id}b`}>
          <rect x="-500" y={y} width="3000" height={h} />
        </clipPath>
        <mask id={`${id}h`} maskUnits="userSpaceOnUse" x="-500" y="-1200" width="3000" height="2000">
          <rect x="-500" y="-1200" width="3000" height="2000" fill="#fff" />
          <path d={MONO.g} stroke="#000" strokeWidth={MONO.reserve} strokeLinejoin="round" />
          <rect x="-500" y={y} width="3000" height={h} fill="#fff" />
        </mask>
        <mask id={`${id}g`} maskUnits="userSpaceOnUse" x="-500" y="-1200" width="3000" height="2000">
          <rect x="-500" y="-1200" width="3000" height="2000" fill="#fff" />
          <path d={MONO.h} stroke="#000" strokeWidth={MONO.reserve} strokeLinejoin="round" clipPath={`url(#${id}b)`} />
        </mask>
      </defs>
      <path className="marque-texte" d={MONO.h} mask={`url(#${id}h)`} />
      <path className="marque-or" d={MONO.g} mask={`url(#${id}g)`} />
    </>
  );
}

export function Monogramme({ className, titre = 'Hugo Gillard', ...c }: { className?: string; titre?: string } & Couleurs) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox={vb(MONO.viewBox)} className={`marque ${className ?? ''}`} style={style(c)} role="img" aria-label={titre}>
      <Entrelacs id={id} />
    </svg>
  );
}

export function Logotype({ className, titre = 'Hugo Gillard', ...c }: { className?: string; titre?: string } & Couleurs) {
  return (
    <svg viewBox={vb(LOGOTYPE.viewBox)} className={`marque ${className ?? ''}`} style={style(c)} role="img" aria-label={titre}>
      <path className="marque-texte" d={LOGOTYPE.d} />
    </svg>
  );
}

export function Mention({ className, ...c }: { className?: string } & Couleurs) {
  return (
    <svg viewBox={vb(MENTION.viewBox)} className={`marque ${className ?? ''}`} style={style(c)} aria-hidden="true">
      <path className="marque-or" d={MENTION.d} />
    </svg>
  );
}

export function Sceau({
  className,
  titre = 'Hugo Gillard, photographie et film',
  ...c
}: { className?: string; titre?: string } & Couleurs) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [x, y, w, h] = MONO.viewBox;
  const e = SCEAU.mono.echelle;
  return (
    <svg viewBox={vb(SCEAU.viewBox)} className={`marque ${className ?? ''}`} style={style(c)} role="img" aria-label={titre}>
      {SCEAU.cercles.map((cercle) => (
        <circle key={cercle.r} r={cercle.r} className="marque-filet" strokeWidth={cercle.w} />
      ))}
      {SCEAU.haut.map((g, i) => (
        <path key={`h${i}`} className="marque-texte" transform={g.t} d={g.d} />
      ))}
      {SCEAU.bas.map((g, i) => (
        <path key={`b${i}`} className="marque-or" transform={g.t} d={g.d} />
      ))}
      {SCEAU.points.map(([px, py]) => (
        <circle key={px} cx={px} cy={py} r="9" className="marque-or" />
      ))}
      <g transform={`scale(${e}) translate(${-(x + w / 2)} ${-(y + h / 2)})`}>
        <Entrelacs id={id} />
      </g>
    </svg>
  );
}

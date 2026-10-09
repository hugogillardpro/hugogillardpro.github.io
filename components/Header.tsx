'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logotype } from './Brand';
import Reseaux from './Reseaux';

const gauche = [
  { href: '/mariages/', label: 'Mariages' },
  { href: '/#films', label: 'Films' },
];
const droite = [
  { href: '/#prestations', label: 'Prestations' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname() ?? '/';
  // Transparent au-dessus des pages qui s'ouvrent sur une grande photo ou la vidéo.
  const transparent = pathname === '/' || /^\/mariages\/[^/]+\/?$/.test(pathname);
  const sentinelle = useRef<HTMLDivElement>(null);
  const [defile, setDefile] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  // L'en-tête devient opaque dès que le haut de page sort de l'écran.
  useEffect(() => {
    const el = sentinelle.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDefile(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  useEffect(() => {
    if (!ouvert) return;
    document.body.style.overflow = 'hidden';
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    window.addEventListener('keydown', touche);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', touche);
    };
  }, [ouvert]);

  const solide = !transparent || defile || ouvert;
  const fermer = () => setOuvert(false);
  const actif = (href: string) => (href === '/mariages/' && pathname.startsWith('/mariages') ? 'page' : undefined);

  return (
    <>
      <div ref={sentinelle} className="sentinelle" aria-hidden="true" />
      <header className={`entete ${solide ? 'entete--solide' : 'entete--transparent'}`}>
        <div className="conteneur entete__barre">
          <nav className="entete__nav entete__nav--gauche" aria-label="Navigation principale">
            <ul>
              {gauche.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={actif(l.href)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="bouton-menu"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? 'Fermer' : 'Menu'}
          </button>
          <Link href="/" className="entete__marque" aria-label="Hugo Gillard, retour à l'accueil">
            <Logotype className="entete__logotype" titre="Hugo Gillard" />
          </Link>
          <div className="entete__droite">
            <nav className="entete__nav" aria-label="Navigation secondaire">
              <ul>
                {droite.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/#contact" className="btn btn--contour entete__cta">
              Vérifier ma date
            </Link>
          </div>
        </div>
      </header>
      <div id="menu-mobile" className="menu-mobile" hidden={!ouvert}>
        <nav aria-label="Menu">
          <ul>
            {[...gauche, ...droite].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={fermer}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/#contact" className="btn" onClick={fermer}>
          Vérifier ma date
        </Link>
        <Reseaux />
      </div>
    </>
  );
}

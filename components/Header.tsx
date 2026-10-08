'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const liens = [
  { href: '/mariages/', label: 'Mariages' },
  { href: '/#films', label: 'Films' },
  { href: '/#prestations', label: 'Prestations' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname() ?? '/';
  // Transparent au-dessus des pages qui s'ouvrent sur une grande photo.
  const transparent = pathname === '/' || /^\/mariages\/[^/]+\/?$/.test(pathname);
  const [defile, setDefile] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const lire = () => setDefile(window.scrollY > 40);
    lire();
    window.addEventListener('scroll', lire, { passive: true });
    return () => window.removeEventListener('scroll', lire);
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

  return (
    <>
      <header className={`entete ${solide ? 'entete--solide' : 'entete--transparent'}`}>
        <div className="conteneur entete__barre">
          <Link href="/" className="marque" aria-label="Hugo Gillard, retour à l'accueil">
            <span className="marque__nom">Hugo Gillard</span>
            <span className="marque__sous">Photo &amp; film de mariage</span>
          </Link>
          <nav className="nav-principale" aria-label="Navigation principale">
            <ul>
              {liens.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.href === '/mariages/' && pathname.startsWith('/mariages') ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/#contact" className="btn btn--contour entete__cta">
            Vérifier ma date
          </Link>
          <button
            type="button"
            className="bouton-menu"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </header>
      <div id="menu-mobile" className="menu-mobile" hidden={!ouvert}>
        <nav aria-label="Menu">
          <ul>
            {liens.map((l) => (
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
      </div>
    </>
  );
}

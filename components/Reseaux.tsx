import { FacebookLogo, InstagramLogo } from '@phosphor-icons/react/ssr';
import { site } from '@/lib/site';

// Liens Instagram et Facebook, en pastilles rondes (comme les autres boutons à icône du site).
export default function Reseaux({ className = '' }: { className?: string }) {
  return (
    <ul className={`reseaux ${className}`}>
      <li>
        <a href={site.instagram} rel="noopener" className="reseau" aria-label={`Instagram (${site.instagramNom})`}>
          <InstagramLogo size={22} weight="light" aria-hidden="true" />
        </a>
      </li>
      <li>
        <a href={site.facebook} rel="noopener" className="reseau" aria-label="Facebook">
          <FacebookLogo size={22} weight="light" aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
}

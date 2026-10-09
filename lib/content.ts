import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { img, type Img } from './images';

// Un mariage = un dossier dans content/mariages/ avec un index.md et ses photos.
const DOSSIER = path.join(process.cwd(), 'content', 'mariages');

const schema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  couple: z.string(),
  date: z.coerce.date().nullable().default(null),
  // À compléter avec Hugo : rien n'est affiché tant que la valeur est vide.
  lieu: z.string().nullable().default(null),
  commune: z.string().nullable().default(null),
  zone: z.enum(['belgique', 'france', 'autre']).nullable().default(null),
  film: z.string().nullable().default(null),
  publie: z.boolean().default(true),
  resume: z.string(),
  hero: z.string(),
  heroAlt: z.string(),
  couverture: z.string(),
  photos: z.array(z.object({ src: z.string(), chapitre: z.string(), alt: z.string() })).min(1),
  // Un avis ne s'affiche que s'il est vérifié (art. VI.100 du Code de droit économique).
  temoignage: z
    .object({ texte: z.string(), verifie: z.boolean(), source: z.string().nullable() })
    .nullable()
    .default(null),
});

export type PhotoMariage = { image: Img; alt: string; chapitre: string };
export type Temoignage = { texte: string; verifie: boolean; source: string | null };
export type Mariage = {
  slug: string;
  couple: string;
  date: Date | null;
  lieu: string | null;
  commune: string | null;
  zone: 'belgique' | 'france' | 'autre' | null;
  film: string | null;
  resume: string;
  hero: Img;
  heroAlt: string;
  couverture: Img;
  photos: PhotoMariage[];
  temoignage: Temoignage | null;
  og: string;
};

function ref(slug: string, src: string): Img {
  const nom = path.basename(src).replace(/\.[^.]+$/, '');
  return img(`/img/${slug}/${nom}`);
}

let cache: Mariage[] | null = null;

// Les mariages publiés, du plus récent au plus ancien (sans date : en dernier).
export function getMariages(): Mariage[] {
  if (cache) return cache;
  const liste: Mariage[] = [];
  for (const d of fs.readdirSync(DOSSIER, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const fichier = path.join(DOSSIER, d.name, 'index.md');
    if (!fs.existsSync(fichier)) continue;
    const { data } = matter(fs.readFileSync(fichier, 'utf8'));
    const r = schema.safeParse(data);
    if (!r.success) {
      const details = r.error.issues.map((i) => `  - ${i.path.join('.')} : ${i.message}`).join('\n');
      throw new Error(`Fiche invalide : ${fichier}\n${details}`);
    }
    const b = r.data;
    if (!b.publie) continue;
    liste.push({
      slug: b.slug,
      couple: b.couple,
      date: b.date,
      lieu: b.lieu,
      commune: b.commune,
      zone: b.zone,
      film: b.film,
      resume: b.resume,
      hero: ref(b.slug, b.hero),
      heroAlt: b.heroAlt,
      couverture: ref(b.slug, b.couverture),
      photos: b.photos.map((p) => ({ image: ref(b.slug, p.src), alt: p.alt, chapitre: p.chapitre })),
      temoignage: b.temoignage,
      og: `/img/${b.slug}/og.jpg`,
    });
  }
  const t = (x: Date | null) => (x ? x.getTime() : 0);
  liste.sort((a, b) => t(b.date) - t(a.date));
  cache = liste;
  return liste;
}

export function getMariage(slug: string): Mariage {
  const m = getMariages().find((x) => x.slug === slug);
  if (!m) throw new Error(`Mariage introuvable : ${slug}`);
  return m;
}

// Regroupe les photos par moment de la journée, dans l'ordre du reportage.
export function chapitres(m: Mariage): { titre: string; photos: PhotoMariage[] }[] {
  const out: { titre: string; photos: PhotoMariage[] }[] = [];
  for (const p of m.photos) {
    const dernier = out[out.length - 1];
    if (dernier && dernier.titre === p.chapitre) dernier.photos.push(p);
    else out.push({ titre: p.chapitre, photos: [p] });
  }
  return out;
}

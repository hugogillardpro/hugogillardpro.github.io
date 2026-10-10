import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { getMariages, type Mariage } from './content';

// Une zone = un fichier content/zones/<slug>.md. Sa page /photographe-mariage/<slug>/ n'est publiée
// que si au moins un mariage publié y est rattaché (champ `zone` de la fiche) : pas de page sans
// mariage réel, donc pas de page vide répétée d'une ville à l'autre.
const DOSSIER = path.join(process.cwd(), 'content', 'zones');

const schema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  nom: z.string(),
  // La zone dans une phrase : « dans le Hainaut », « à Bruxelles », « en province de Namur ».
  dans: z.string(),
  // Nom administratif, pour les données structurées.
  officiel: z.string(),
  ordre: z.number(),
  description: z.string().max(170),
  intro: z.string(),
});

export type Zone = z.infer<typeof schema> & { texte: string[]; mariages: Mariage[] };

let cache: Zone[] | null = null;

// Toutes les zones, publiées ou non, dans l'ordre choisi.
export function getZones(): Zone[] {
  if (cache) return cache;
  const mariages = getMariages();
  const liste: Zone[] = [];
  for (const f of fs.readdirSync(DOSSIER)) {
    if (!f.endsWith('.md')) continue;
    const fichier = path.join(DOSSIER, f);
    const { data, content } = matter(fs.readFileSync(fichier, 'utf8'));
    const r = schema.safeParse(data);
    if (!r.success) {
      const details = r.error.issues.map((i) => `  - ${i.path.join('.')} : ${i.message}`).join('\n');
      throw new Error(`Zone invalide : ${fichier}\n${details}`);
    }
    // Texte libre facultatif : un paragraphe par bloc, commentaires HTML ignorés.
    const texte = content
      .replace(/<!--[\s\S]*?-->/g, '')
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    liste.push({ ...r.data, texte, mariages: mariages.filter((m) => m.zone === r.data.slug) });
  }
  liste.sort((a, b) => a.ordre - b.ordre);
  cache = liste;
  return liste;
}

// Les zones qui ont une page : au moins un mariage publié.
export function getZonesPubliees(): Zone[] {
  return getZones().filter((zn) => zn.mariages.length > 0);
}

export function getZone(slug: string): Zone {
  const zn = getZonesPubliees().find((x) => x.slug === slug);
  if (!zn) throw new Error(`Zone introuvable ou sans mariage : ${slug}`);
  return zn;
}

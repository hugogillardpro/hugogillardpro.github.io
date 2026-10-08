import fs from 'node:fs';
import path from 'node:path';

// Une image générée par scripts/images.mjs : son identifiant (/img/<dossier>/<nom>),
// ses dimensions d'origine et une version floue minuscule affichée pendant le chargement.
export type Img = { id: string; width: number; height: number; blur: string };

type Manifeste = Record<string, { width: number; height: number; blur: string; hash?: string }>;

let cache: Manifeste | null = null;

function manifeste(): Manifeste {
  if (!cache) {
    const fichier = path.join(process.cwd(), 'public', 'img', 'manifest.json');
    if (!fs.existsSync(fichier)) {
      throw new Error('public/img/manifest.json manquant : lancez `npm run images` avant le build.');
    }
    cache = JSON.parse(fs.readFileSync(fichier, 'utf8')) as Manifeste;
  }
  return cache;
}

export function img(id: string): Img {
  const m = manifeste()[id];
  if (!m) throw new Error(`Image inconnue : ${id}. Vérifiez le nom du fichier, puis lancez \`npm run images\`.`);
  return { id, width: m.width, height: m.height, blur: m.blur };
}

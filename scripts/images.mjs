// Génère les images du site dans public/img/ à partir de content/ :
// - pour chaque photo : des WebP en plusieurs largeurs + une version floue minuscule ;
// - pour chaque mariage : une image de partage (og.jpg, 1200×630) à partir de la photo « hero » ;
// - pour chaque film YouTube : sa vignette (téléchargée une fois dans content/films/).
// Un manifeste (public/img/manifest.json) donne dimensions et flou à next/image.
// Le travail déjà fait est réutilisé : une photo inchangée n'est pas recalculée.
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const RACINE = process.cwd();
const CONTENU = path.join(RACINE, 'content');
const SORTIE = path.join(RACINE, 'public', 'img');
const MANIFESTE = path.join(SORTIE, 'manifest.json');
const LARGEURS = [400, 800, 1200, 1600, 2000];
const qualite = (w) => (w <= 400 ? 70 : w <= 800 ? 74 : w <= 1200 ? 78 : 82);

const debut = Date.now();
const ancien = await lireJson(MANIFESTE, {});
const manifeste = {};
const taches = [];

async function existe(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function lireJson(p, defaut) {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return defaut;
  }
}

// 1. Photos des mariages et image de partage.
const dossiers = (await fs.readdir(path.join(CONTENU, 'mariages'), { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const idsFilms = new Set();

for (const slug of dossiers) {
  const dossier = path.join(CONTENU, 'mariages', slug);
  const fichiers = (await fs.readdir(dossier)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const f of fichiers) {
    taches.push({ id: `/img/${slug}/${f.replace(/\.[^.]+$/, '')}`, source: path.join(dossier, f) });
  }
  const fiche = await fs.readFile(path.join(dossier, 'index.md'), 'utf8').catch(() => '');
  const hero = fiche.match(/^hero:\s*\.\/(\S+)/m)?.[1];
  if (hero) taches.push({ id: `/img/${slug}/og`, source: path.join(dossier, hero), og: true });
  const film = fiche.match(/^film:\s*"?([A-Za-z0-9_-]{6,})"?/m)?.[1];
  if (film) idsFilms.add(film);
}

// 1 bis. Images de l'accueil (affiche de la vidéo).
const dossierAccueil = path.join(CONTENU, 'accueil');
if (await existe(dossierAccueil)) {
  for (const f of (await fs.readdir(dossierAccueil)).filter((x) => /\.(jpe?g|png)$/i.test(x))) {
    taches.push({ id: `/img/accueil/${f.replace(/\.[^.]+$/, '')}`, source: path.join(dossierAccueil, f) });
  }
}

// 2. Vignettes des films YouTube.
for (const f of await lireJson(path.join(CONTENU, 'films.json'), [])) idsFilms.add(f.id);
await fs.mkdir(path.join(CONTENU, 'films'), { recursive: true });
for (const id of idsFilms) {
  const local = path.join(CONTENU, 'films', `${id}.jpg`);
  if (!(await existe(local))) {
    const r = await fetch(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
    if (!r.ok) throw new Error(`Vignette YouTube introuvable pour ${id} (HTTP ${r.status})`);
    await fs.writeFile(local, Buffer.from(await r.arrayBuffer()));
    console.log(`vignette téléchargée : content/films/${id}.jpg`);
  }
  taches.push({ id: `/img/films/${id}`, source: local });
}

// 3. Traitement.
async function traiter(t) {
  const donnees = await fs.readFile(t.source);
  const hash = createHash('sha1')
    .update(donnees)
    .update(t.og ? 'og-v1' : 'webp-v1')
    .digest('hex')
    .slice(0, 12);
  const base = path.join(SORTIE, t.id.replace(/^\/img\//, ''));
  await fs.mkdir(path.dirname(base), { recursive: true });

  if (t.og) {
    const sortie = `${base}.jpg`;
    const aJour = ancien[t.id]?.hash === hash && (await existe(sortie));
    if (!aJour) {
      await sharp(donnees)
        .rotate()
        .resize(1200, 630, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(sortie);
    }
    manifeste[t.id] = { width: 1200, height: 630, blur: '', hash };
    return !aJour;
  }

  const image = sharp(donnees).rotate();
  const meta = await image.metadata();
  const tourne = (meta.orientation ?? 1) >= 5;
  const width = tourne ? meta.height : meta.width;
  const height = tourne ? meta.width : meta.height;
  const tailles = [...LARGEURS.filter((w) => w < width), width];
  const fichiers = tailles.map((w) => `${base}-${w}.webp`);
  const aJour =
    ancien[t.id]?.hash === hash && ancien[t.id]?.blur && (await Promise.all(fichiers.map(existe))).every(Boolean);

  if (aJour) {
    manifeste[t.id] = { width, height, blur: ancien[t.id].blur, hash };
    return false;
  }
  await Promise.all(
    tailles.map((w, i) =>
      image
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: qualite(w), effort: 4 })
        .toFile(fichiers[i]),
    ),
  );
  const flou = await image.clone().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifeste[t.id] = { width, height, blur: `data:image/webp;base64,${flou.toString('base64')}`, hash };
  return true;
}

const parallele = Math.max(2, Math.min(8, os.cpus().length - 1));
let indice = 0;
let regenerees = 0;
await Promise.all(
  Array.from({ length: parallele }, async () => {
    while (indice < taches.length) {
      const t = taches[indice++];
      try {
        if (await traiter(t)) regenerees++;
      } catch (e) {
        throw new Error(`Échec sur ${t.source} : ${e.message}`);
      }
    }
  }),
);

const trie = Object.fromEntries(Object.keys(manifeste).sort().map((k) => [k, manifeste[k]]));
await fs.writeFile(MANIFESTE, JSON.stringify(trie));
console.log(
  `images : ${taches.length} entrées, ${regenerees} régénérées, ${((Date.now() - debut) / 1000).toFixed(1)} s`,
);

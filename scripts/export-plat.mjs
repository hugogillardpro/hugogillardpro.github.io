// Next.js 16 range les données de préchargement des pages dans des sous-dossiers
// (mariages/__next.mariages/__PAGE__.txt) mais les demande à plat
// (mariages/__next.mariages.__PAGE__.txt). Sans serveur Next (GitHub Pages, aperçu statique),
// chaque préchargement finirait en 404 : on ajoute une copie à plat de chaque fichier.
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
let copies = 0;

for (const e of await fs.readdir(OUT, { recursive: true, withFileTypes: true })) {
  if (!e.isDirectory() || !e.name.startsWith('__next.')) continue;
  // Seulement les dossiers __next.* de premier niveau (pas ceux imbriqués dans un autre).
  if (path.relative(OUT, e.parentPath).split(path.sep).some((p) => p.startsWith('__next.'))) continue;
  const dossier = path.join(e.parentPath, e.name);
  for (const f of await fs.readdir(dossier, { recursive: true, withFileTypes: true })) {
    if (!f.isFile()) continue;
    const relatif = path.relative(dossier, path.join(f.parentPath, f.name));
    const plat = [e.name, ...relatif.split(path.sep)].join('.');
    await fs.copyFile(path.join(f.parentPath, f.name), path.join(e.parentPath, plat));
    copies++;
  }
}
console.log(`export : ${copies} fichiers de préchargement mis à plat`);

// Chargeur d'images pour next/image en export statique.
// `src` a la forme "/img/<dossier>/<nom>~<largeur d'origine>" ; les fichiers générés par
// scripts/images.mjs sont "/img/<dossier>/<nom>-<largeur>.webp" pour chaque largeur disponible.
const LARGEURS = [400, 800, 1200, 1600, 2000];

export default function chargeur({ src, width }: { src: string; width: number }): string {
  const m = src.match(/^(.*)~(\d+)$/);
  if (!m) return src;
  const base = m[1];
  const max = Number(m[2]);
  const disponibles = [...LARGEURS.filter((w) => w < max), max];
  const choisie = disponibles.find((w) => w >= width) ?? max;
  return `${base}-${choisie}.webp`;
}

export function dateMois(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function dateLongue(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function lieuTexte(d: { lieu: string | null; commune: string | null }): string {
  return [d.lieu, d.commune].filter(Boolean).join(', ');
}

// Les mariages publiés, du plus récent au plus ancien.
export function trierMariages<T extends { data: { date: Date | null; publie: boolean } }>(liste: T[]): T[] {
  const t = (d: Date | null) => (d ? d.getTime() : 0);
  return liste.filter((m) => m.data.publie).sort((a, b) => t(b.data.date) - t(a.data.date));
}

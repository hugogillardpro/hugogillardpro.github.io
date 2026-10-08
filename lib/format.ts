export function dateMois(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function dateLongue(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function lieuTexte(m: { lieu: string | null; commune: string | null }): string {
  return [m.lieu, m.commune].filter(Boolean).join(', ');
}

export function majuscule(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

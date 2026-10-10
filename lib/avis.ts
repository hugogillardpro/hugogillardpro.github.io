import { z } from 'zod';
import avisJson from '@/content/avis.json';

// Avis des mariés (content/avis.json). Un avis n'est publié que si `verifie: true`, une fois sa provenance
// confirmée par Hugo (avis Google, message des mariés) : publier un avis non vérifié comme venant d'un
// client est interdit (art. VI.100 du Code de droit économique).
const schema = z.array(
  z.object({
    couple: z.string(),
    texte: z.string(),
    date: z.coerce.date().nullable(),
    lieu: z.string().nullable(),
    // Slug du mariage sur le site, s'il y en a un : l'avis s'affiche aussi sur sa page.
    mariage: z.string().nullable(),
    verifie: z.boolean(),
    // Affiché sous l'avis : « Avis Google », « Message des mariés »…
    source: z.string().nullable(),
  }),
);

export type Avis = z.infer<typeof schema>[number];

const tous = schema.parse(avisJson);

export function getAvis(): Avis[] {
  return tous.filter((a) => a.verifie);
}

export function getAvisMariage(slug: string): Avis | undefined {
  return getAvis().find((a) => a.mariage === slug);
}

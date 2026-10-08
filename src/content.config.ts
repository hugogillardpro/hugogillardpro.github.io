import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un mariage = un dossier dans src/content/mariages/ avec un index.md et ses photos.
const mariages = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/mariages' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      couple: z.string(),
      date: z.coerce.date().nullable().default(null),
      // À compléter avec Hugo : rien n'est affiché tant que la valeur est vide.
      lieu: z.string().nullable().default(null),
      commune: z.string().nullable().default(null),
      zone: z.enum(['hainaut', 'nord', 'autre']).nullable().default(null),
      film: z.string().nullable().default(null),
      publie: z.boolean().default(true),
      resume: z.string(),
      couverture: image(),
      hero: image(),
      heroAlt: z.string(),
      photos: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            chapitre: z.string(),
          }),
        )
        .min(1),
      temoignage: z
        .object({
          texte: z.string(),
          // Un avis ne s'affiche que s'il est vérifié (art. VI.100 CDE).
          verifie: z.boolean(),
          source: z.string().nullable(),
        })
        .nullable()
        .default(null),
    }),
});

export const collections = { mariages };

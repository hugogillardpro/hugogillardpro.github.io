# hugogillardpro.com

Site d'Hugo Gillard, photographe et vidéaste de mariage. Construit avec [Next.js](https://nextjs.org/docs) en export statique, publié sur GitHub Pages.

## Travailler en local

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # génère le site dans out/
npm run preview   # sert out/ sur http://localhost:4323 comme GitHub Pages le ferait
```

Node 22.12 ou plus récent. Le script `scripts/images.mjs` (lancé automatiquement par `dev` et `build`) crée les variantes WebP de toutes les photos dans `public/img/`, qui n'est pas versionné.

## Ajouter un mariage

1. Créer un dossier `content/mariages/prenom-et-prenom/`.
2. Y déposer 10 à 20 photos JPEG (2000 px sur le grand côté suffit), avec des noms parlants : `prenom-prenom-sortie-eglise.jpg`.
3. Créer `index.md` dans ce dossier, sur le modèle d'un mariage existant :

```yaml
---
slug: prenom-et-prenom        # l'adresse de la page : /mariages/prenom-et-prenom/
couple: "Prénom & Prénom"
date: 2026-09-19              # ou null
lieu: "Nom de la salle"       # ou null : rien n'est affiché
commune: "Commune"            # ou null
zone: hainaut                 # hainaut, nord, autre ou null
film: null                    # identifiant YouTube du teaser, ex. 2l7xX6kgNaI
publie: true                  # false pour masquer la page
resume: "Une ou deux phrases sur le déroulé de la journée."
hero: ./grande-photo-horizontale.jpg
heroAlt: "Description de la grande photo"
couverture: ./photo-verticale.jpg
photos:
  - src: ./photo-1.jpg
    chapitre: "Les préparatifs"   # Les préparatifs, La cérémonie, Les photos de couple, Le vin d'honneur, La soirée
    alt: "Ce qu'on voit sur la photo"
temoignage: null
---
```

Les photos s'affichent dans l'ordre de la liste. Deux photos verticales qui se suivent sont placées côte à côte, une photo horizontale prend toute la largeur. Chaque fiche est vérifiée au build : s'il manque un champ ou une photo, le build échoue et le site en ligne ne change pas.

## Réglages

- `lib/site.ts` : coordonnées, formules et prix (« à partir de »), mentions légales, mariage mis en avant sur l'accueil.
- `content/films.json` : les teasers YouTube de l'accueil.
- Un témoignage ne s'affiche que si `verifie: true`, une fois sa provenance confirmée (avis Google, message des mariés).

## Mise en ligne

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`.

Avant le premier déploiement : **Settings › Pages › Build and deployment › Source : GitHub Actions**. Le domaine `hugogillardpro.com` reste réglé dans Settings › Pages (le fichier `public/CNAME` est conservé).

# hugogillardpro.com

Site d'Hugo Gillard, photographe et vidéaste de mariage. Construit avec [Astro](https://docs.astro.build) en site statique, publié sur GitHub Pages.

## Travailler en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère le site dans dist/
```

Node 22.12 ou plus récent.

## Ajouter un mariage

1. Créer un dossier `src/content/mariages/prenom-et-prenom/`.
2. Y déposer 10 à 20 photos JPEG de 1600 px de large ou de haut, avec des noms parlants (`prenom-prenom-sortie-eglise.jpg`).
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

Les photos sont affichées dans l'ordre de la liste. Deux photos verticales qui se suivent sont placées côte à côte, une photo horizontale prend toute la largeur.

Le site vérifie chaque fiche au moment du build : s'il manque un champ ou une photo, le build échoue et le site en ligne ne change pas.

## Réglages

- `src/data/site.ts` : coordonnées, formules et prix (« à partir de »), teasers YouTube, mentions légales, mariage mis en avant sur l'accueil.
- Un témoignage ne s'affiche que si `verifie: true`, une fois sa provenance confirmée (avis Google, message des mariés).

## Mise en ligne

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`.

Avant le premier déploiement : **Settings › Pages › Build and deployment › Source : GitHub Actions**. Le domaine `hugogillardpro.com` reste réglé dans Settings › Pages (le fichier `public/CNAME` est conservé).

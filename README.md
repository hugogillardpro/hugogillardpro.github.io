# hugogillardpro.com

Site d'Hugo Gillard, photographe et vidéaste de mariage. Construit avec [Next.js](https://nextjs.org/docs) en export statique, publié sur Vercel (voir « Mise en ligne »).

## Travailler en local

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # génère le site dans out/
npm run preview   # sert out/ sur http://localhost:4323 comme Vercel le ferait
```

Node 22.12 ou plus récent. Si le port 3000 est déjà pris (par exemple par un autre projet Next.js), `npm run dev` choisit un autre port : utilisez l'adresse indiquée sur la ligne « Local: » du terminal. Le script `scripts/images.mjs` (lancé automatiquement par `dev` et `build`) crée les variantes WebP de toutes les photos dans `public/img/`, qui n'est pas versionné.

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
zone: hainaut                 # hainaut, bruxelles, brabant-wallon, namur, liege, luxembourg, flandre, nord, autre ou null
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
---
```

Les photos s'affichent dans l'ordre de la liste. Deux photos verticales qui se suivent sont placées côte à côte, une photo horizontale prend toute la largeur. Chaque fiche est vérifiée au build : s'il manque un champ ou une photo, le build échoue et le site en ligne ne change pas.

## Pages par région

Les pages `/photographe-mariage/<zone>/` (Hainaut, Bruxelles, Brabant wallon, Namur, Liège, Luxembourg, Flandre, Nord de la France et Hauts-de-France) n'apparaissent que lorsqu'au moins un mariage publié y est rattaché : il suffit d'indiquer `zone: hainaut` (par exemple) dans la fiche du mariage. Tant qu'aucune zone n'a de mariage, aucune page locale n'est publiée, et l'index `/photographe-mariage/` n'est ni indexé ni lié.

Le texte de chaque zone est dans `content/zones/<zone>.md` : `description` pour Google, `intro` sous le titre, et un texte libre facultatif sous les mariages (salles connues, endroits pour les photos de couple). Une page sans mariage réel, avec le même texte d'une ville à l'autre, serait vue par Google comme une page satellite : c'est pour cela que la règle est automatique.

## Réglages

- `lib/site.ts` : coordonnées, formules et prix (« à partir de »), mentions légales, mariage mis en avant sur l'accueil.
- `content/films.json` : les teasers YouTube de l'accueil.
- `content/avis.json` : les avis des mariés. Un avis ne s'affiche (accueil, et page du mariage si `mariage` est renseigné) que si `verifie: true`, une fois sa provenance confirmée par Hugo (avis Google, message des mariés) : publier un avis non vérifié comme venant d'un client est interdit (art. VI.100 du Code de droit économique).

## Vidéo d'ouverture

`public/video/hero.mp4` (1920 × 1080) et `public/video/hero-vertical.mp4` (1080 × 1920, recadrage centré) sont tirés de la version 4K du film de Laura & Alexis sur YouTube. L'affiche `content/accueil/hero-poster.jpg` est l'image de la 11e seconde. Pour les refaire à partir d'une source 4K (`source.webm`) avec [ffmpeg](https://ffmpeg.org) :

```bash
ffmpeg -i source.webm -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset veryslow -profile:v high -level 4.0 -pix_fmt yuv420p -crf 28 -maxrate 4000k -bufsize 8000k -g 50 -an -movflags +faststart public/video/hero.mp4
ffmpeg -i source.webm -vf "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -preset veryslow -profile:v high -level 4.0 -pix_fmt yuv420p -crf 30 -maxrate 3000k -bufsize 6000k -g 50 -an -movflags +faststart public/video/hero-vertical.mp4
ffmpeg -ss 11 -i source.webm -vf "scale=1920:1080:flags=lanczos" -frames:v 1 -q:v 2 content/accueil/hero-poster.jpg
```

Garder le H.264 (lu partout, décodé par la puce de tous les téléphones), sans piste son, et `+faststart` pour que la lecture commence avant la fin du téléchargement.

## Logo

Le monogramme, le sceau et le logotype sont dessinés à partir des contours de Playfair Display et de Jost. `public/brand/` contient les fichiers SVG autonomes (versions sombres et `-clair` pour fond foncé) pour l'impression, les réseaux ou une signature d'e-mail. Pour les modifier : `pip install fonttools brotli`, ajuster `scripts/logo.py`, puis `python scripts/logo.py`, qui régénère aussi `lib/brand.ts` et `public/favicon.svg`.

## Aperçu sur Vercel

`npm run apercu` construit une version d'aperçu et la publie sur https://hugogillard-apercu.vercel.app (projet Vercel séparé : le site en ligne n'est pas touché). Cette version est masquée aux moteurs de recherche, n'a pas de traceur Google Ads et son formulaire n'envoie rien. Il faut être connecté à Vercel (`vercel login`) avec un accès à l'équipe Adista.

## Mise en ligne

### Vercel

Le site est publié par Vercel (projet de l'équipe Adista relié à ce dépôt GitHub) : chaque push sur `main` part en production, chaque autre branche reçoit une adresse d'aperçu. `vercel.json` fixe les réglages pour qu'ils ne dépendent pas du tableau de bord : build `npm run build`, dossier `out/` servi tel quel, barre oblique finale ajoutée aux adresses, cache long pour les fichiers de `/_next/static/` (leur nom change à chaque version).

Vercel Web Analytics (onglet **Analytics** du projet) n'est chargé que dans le site construit par Vercel (`vercel` dans `lib/site.ts`), jamais dans l'aperçu local. Il ne dépose pas de cookie : il n'entre pas dans le bandeau de consentement, et la page Confidentialité le mentionne dès que le site est construit par Vercel.

### Nom de domaine

hugogillardpro.com est enregistré chez Namecheap, qui garde les DNS : un enregistrement A pour `@` et un CNAME pour `www`, avec les valeurs indiquées par Vercel (**Settings › Domains**), qui redirige `www` vers `hugogillardpro.com` et fournit le certificat HTTPS. Ne pas toucher aux enregistrements MX et TXT : ils servent à la messagerie (Namecheap Private Email).

### Ancienne publication sur GitHub Pages

Jusqu'au 1er novembre 2026, le site était publié par GitHub Pages depuis le dépôt d'Hugo. Le workflow de publication et les fichiers `CNAME` ont été retirés après le passage du domaine sur Vercel. Il reste au propriétaire du dépôt à retirer le domaine et à désactiver GitHub Pages (**Settings › Pages**) : la dernière version publiée redirige vers hugogillardpro.com en attendant.

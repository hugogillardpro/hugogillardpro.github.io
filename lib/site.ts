import filmsJson from '@/content/films.json';

// Version d'aperçu (Vercel), construite avec NEXT_PUBLIC_APERCU=1 : pages masquées aux moteurs,
// traceur Google Ads coupé et formulaire qui n'envoie rien. Le site publié n'est pas concerné.
export const apercu = process.env.NEXT_PUBLIC_APERCU === '1';

// Coordonnées et réglages communs à tout le site.
export const site = {
  nom: 'Hugo Gillard',
  metier: 'Photographe et vidéaste de mariage',
  url: 'https://hugogillardpro.com',
  email: 'hugo.gillard@hotmail.com',
  telephone: '+32493385667',
  telephoneAffiche: '0493 38 56 67',
  instagram: 'https://www.instagram.com/hugogillardpro',
  instagramNom: '@hugogillardpro',
  facebook: 'https://www.facebook.com/hugoglld',
  zones: 'Toute la Belgique et le Nord de la France',
  delaiReponse: 'sous 48 heures',
  // Durée de conservation des demandes de contact (page Confidentialité) : à confirmer avec Hugo.
  conservation: "trois ans après notre dernier échange, si aucun contrat n'est signé",
  formspree: 'https://formspree.io/f/mqpaqwgy',
  googleSiteVerification: 'uz9a3n2h6Sc9P8yIXfVL0pPLHN7mAeqFYv8E0Qq8OZQ',
  googleAds: {
    id: 'AW-18470690217',
    conversion: 'AW-18470690217/VG4cCNaF9oIdEKm7wedE',
  },
  // Mentions légales (art. XII.6 du Code de droit économique) : à compléter avec Hugo.
  // Une ligne vide n'est pas affichée.
  legal: {
    denomination: null as string | null,
    adresse: null as string | null,
    bce: null as string | null,
    tva: null as string | null,
  },
};

// Formules reprises du site actuel. Le prix « à partir de » s'affiche dès qu'il est renseigné (TVAC).
// `image` : une photo choisie par Hugo pour son ancien site (ou l'image du teaser pour le film).
export type Prestation = {
  nom: string;
  description: string;
  inclus: string[];
  prix: string | null;
  note: string | null;
  image: string;
  alt: string;
  // « Voir un exemple » : un teaser YouTube (repris de l'ancien site) ou la page d'un mariage.
  exemple: { film: string; couple: string } | { mariage: string; couple: string } | null;
};

export const prestations: Prestation[] = [
  {
    nom: 'Reportage photo',
    description:
      "Je suis votre journée des préparatifs jusqu'à la pièce montée, et je photographie ce qui se passe.",
    inclus: ['Environ 700 photos retouchées', 'Galerie privée en ligne', 'Livraison en 3 à 5 mois'],
    prix: null,
    note: null,
    image: '/img/sophie-et-quentin/sophie-quentin-sous-le-voile',
    alt: "Sophie et Quentin sous le voile, dans la nef d'une église gothique, en noir et blanc",
    exemple: { mariage: 'sophie-et-quentin', couple: 'Sophie & Quentin' },
  },
  {
    nom: 'Film de mariage',
    description:
      "Un teaser de 30 secondes, puis un film d'une dizaine de minutes, monté sur une musique que nous choisissons ensemble.",
    inclus: ['Teaser de 30 secondes', "Film d'environ 10 minutes", 'Musique choisie ensemble'],
    prix: null,
    note: null,
    image: '/img/films/ofZSioZLUv4',
    alt: "Image du film d'Elodie et Cédric : les mariés enlacés devant une grange, au soleil couchant",
    exemple: { film: 'ofZSioZLUv4', couple: 'Elodie & Cédric' },
  },
  {
    nom: 'Photo et film',
    description: 'Les deux regards sur la même journée : les photos, le teaser et le film.',
    inclus: ['Environ 500 photos retouchées', 'Teaser de 30 secondes', "Film d'environ 8 minutes"],
    prix: null,
    note: 'La plus complète',
    image: '/img/laura-et-alexis/laura-alexis-portee-baiser',
    alt: "Alexis porte Laura et l'embrasse, sa robe virevoltant devant une grande demeure blanche",
    exemple: { film: '2l7xX6kgNaI', couple: 'Laura & Alexis' },
  },
];

// Teasers YouTube. `mariage` relie le film à la page du mariage quand elle existe.
export const films: { id: string; couple: string; mariage: string | null }[] = filmsJson;

// Accueil : le mariage dont la grande photo ouvre la page, et les photos de la section « Mon approche ».
export const accueil = {
  // Vidéo d'ouverture (extrait du film de Laura & Alexis) et son affiche.
  // srcVertical : la même vidéo recadrée en 9:16 (540 × 960, 2 Mo) pour les écrans en hauteur.
  video: {
    src: '/video/hero.mp4',
    srcVertical: '/video/hero-vertical.mp4',
    affiche: '/img/accueil/hero-poster',
    couple: 'Laura & Alexis',
    mariage: 'laura-et-alexis',
  },
  mariageEnUne: 'sophie-et-quentin',
  // La grande photo est celle qu'Hugo avait choisie pour la présentation de son ancien site.
  apropos: {
    grande: '/img/sophie-et-quentin/sophie-quentin-pose-porte-glycine',
    petite: '/img/thomas-et-jenny/thomas-jenny-ceremonie-plein-air',
  },
};

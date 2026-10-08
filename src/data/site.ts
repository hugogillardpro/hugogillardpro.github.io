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
  zones: 'Hainaut et Nord de la France',
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
export const prestations: { nom: string; inclus: string[]; prix: string | null }[] = [
  {
    nom: 'Reportage photo',
    inclus: ['Environ 700 photos retouchées', 'Galerie privée en ligne', 'Livraison en 3 à 5 mois'],
    prix: null,
  },
  {
    nom: 'Film de mariage',
    inclus: ['Teaser de 30 secondes', "Film d'environ 10 minutes", 'Musique choisie ensemble'],
    prix: null,
  },
  {
    nom: 'Photo et film',
    inclus: ['Environ 500 photos retouchées', 'Teaser de 30 secondes', "Film d'environ 8 minutes"],
    prix: null,
  },
];

// Teasers YouTube. `mariage` relie le film à la page du mariage quand elle existe.
export const films: { id: string; couple: string; mariage: string | null }[] = [
  { id: '2l7xX6kgNaI', couple: 'Laura & Alexis', mariage: 'laura-et-alexis' },
  { id: 'ofZSioZLUv4', couple: 'Elodie & Cédric', mariage: null },
  { id: 'ly2Z-JTnLgo', couple: 'Allan & Louis', mariage: 'allan-et-louis' },
  { id: 'JgsFC42_100', couple: 'Floralie & Benoît', mariage: null },
];

// Accueil : le mariage dont la grande photo ouvre la page (slug), sinon le plus récent.
export const accueil = {
  mariageEnUne: 'sophie-et-quentin' as string | null,
};

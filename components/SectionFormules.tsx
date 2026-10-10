import Prestations from './Prestations';
import { img } from '@/lib/images';
import { prestations, site } from '@/lib/site';

// La section « Les formules », commune à l'accueil et aux pages locales.
export default function SectionFormules() {
  const formules = prestations.map((p) => ({ ...p, image: img(p.image) }));
  return (
    <section className="section section--creme2" id="prestations" aria-labelledby="titre-prestations">
      <div className="conteneur">
        <div className="tete-section">
          <h2 id="titre-prestations">Les formules</h2>
          <p className="chapo">
            Chacune couvre votre journée, des préparatifs jusqu'à la pièce montée. Le tarif dépend de la formule, de la
            date et du lieu : envoyez-moi les vôtres, je vous réponds {site.delaiReponse}.
          </p>
        </div>
        <Prestations formules={formules} />
      </div>
    </section>
  );
}

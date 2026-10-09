import { FacebookLogo, InstagramLogo } from '@phosphor-icons/react/ssr';
import ContactForm from './ContactForm';
import { site } from '@/lib/site';

export default function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="titre-contact">
      <div className="conteneur contact">
        <div className="contact__texte">
          <h2 id="titre-contact">Parlons de votre mariage</h2>
          <p className="texte">
            Envoyez-moi votre date et le lieu : je vous dis si je suis libre, et on en parle. Je réponds{' '}
            {site.delaiReponse}.
          </p>
          <dl className="coordonnees">
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>
                <a href={`tel:${site.telephone}`}>{site.telephoneAffiche}</a>
              </dd>
            </div>
            <div>
              <dt>Réseaux</dt>
              <dd className="coordonnees__reseaux">
                <a href={site.instagram} rel="noopener">
                  <InstagramLogo size={20} weight="light" aria-hidden="true" />
                  {site.instagramNom}
                </a>
                <a href={site.facebook} rel="noopener">
                  <FacebookLogo size={20} weight="light" aria-hidden="true" />
                  Facebook
                </a>
              </dd>
            </div>
            <div>
              <dt>Zones</dt>
              <dd>{site.zones}, ailleurs sur demande</dd>
            </div>
          </dl>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

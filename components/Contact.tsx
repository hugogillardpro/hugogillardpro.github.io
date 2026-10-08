import ContactForm from './ContactForm';
import Reveal from './Reveal';
import { site } from '@/lib/site';

export default function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="titre-contact">
      <div className="conteneur contact">
        <Reveal className="contact__texte">
          <p className="sur-titre">Contact</p>
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
              <dt>Instagram</dt>
              <dd>
                <a href={site.instagram} rel="noopener">
                  {site.instagramNom}
                </a>
              </dd>
            </div>
            <div>
              <dt>Zones</dt>
              <dd>{site.zones}, ailleurs sur demande</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

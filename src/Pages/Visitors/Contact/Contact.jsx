import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '../../../Components/Forms/ContactForm.Component';


// Page Contact, qui intégre les coordonnées de l'école de musique ainsi qu'un Composant formulaire de contact. Les messages envoyés via ce formulaire de contact sont consultables sur l'espace utilisateur par les *ROLES*


export default function Contact() {
  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - Contact</title></Helmet>

      <div id='category'>
        <h2>Contact</h2>
        <h3>Vous avez une question ?</h3>
        <h3>Vous souhaitez intégrer notre formation ?</h3>
      </div>

      <div className='pagePattern__content'>
        <div>
          <h3 className='pagePattern__subheading'>Contact</h3>
          <div className='separator'></div>
          <p>Salle Léon URBAIN</p>
          <p>Ecole de Musique rue Ferrer 62750 LOOS EN GOHELLE</p>
          <p>03.21.28.21.05</p>
        </div>

        <div id='contactForm'>
          <h3 className='pagePattern__subheading'>Formulaire</h3>
          <div className='separator'></div>

          {/* Intégration du composant "ContactForm" */}
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

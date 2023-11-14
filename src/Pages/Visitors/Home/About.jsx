import React from 'react';
import { Helmet } from 'react-helmet';

// Page About, qui retourne l'histoire de La Condordia sous forme de paragraphes 

export default function About() {
  return (
    <div>
      <Helmet><title>La Concordia - A propos</title></Helmet>

      <div className='pagePattern'>
        <div id='category'>
          <h2>La Concordia</h2>
        </div>
        <div className='pagePattern__content'>
          <h3 className='pagePattern__subheading'>Qui sommes-nous ?</h3>
          <div className='aboutContent'>
            <p>Implantée à Loos en Gohelle au coeur du bassin minier, l'Harmonie Municipale la Concordia fût créée en 1881, à cette époque elle n'était composée que d'une clique, de tambours et de clairons, au fil des années, elle devint une harmonie complète avec toutes sortes d'instruments indispensables pour jouer la musique classique, moderne et marches militaires.</p>
            <p>Composée en 2015, d'une soixantaine de membres, elle contribue à son évolution personnelle avec sa propre école de musique qui attire de plus en plus de futurs jeunes musiciens.</p>
            <p>Cette formation musicale participe aux sorties officielles municipales mais organise aussi des concerts privés ou en commun avec d'autres groupes musicaux, elle participe aussi à des galas, défilés, et autres animations musicales dans d'autres communes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

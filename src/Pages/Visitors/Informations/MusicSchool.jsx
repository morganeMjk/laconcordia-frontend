import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Page MusicSchool, qui retourne les informations relatives à l'école de musique.

export default function MusicSchool() {
  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - École de musique</title></Helmet>

      <div id='category'>
        <h2>École de musique</h2>
        <h3>Effectif actuel</h3>
      </div>

      <div className='musicSchool pagePattern__content'>
        <div>
          <h3 className='pagePattern__subheading'>Formations</h3>
          <div className='separator'></div>
          <ul>
            <li>Musicale</li>
            <li>Instrumentale</li>
          </ul>
        </div>

        <div>
          <h3 className='pagePattern__subheading'>Instruments enseignés</h3>
          <div className='separator'></div>
          <ul>
            <li><div className='musicSchool__professor'><div>Percussions</div><div>Jérôme Dupuich</div></div></li>
            <li><div className='musicSchool__professor'><div>Flûtes</div><div>Elodie Kryslak</div></div></li>
            <li><div className='musicSchool__professor'><div>Cuivres</div><div>Alexandre Chirol</div></div></li>
            <li><div className='musicSchool__professor'><div>Trombones</div><div>Cédric</div></div></li>
            <li><div className='musicSchool__professor'><div>Classe d'éveil</div><div> </div></div></li>
            <li><div className='musicSchool__professor'><div>Saxophone</div><div> </div></div></li>
            <li><div className='musicSchool__professor'><div>Formation musicale</div><div>Benoît Ambrozy</div></div></li>
          </ul>
        </div>

        <div>
          <h3 className='pagePattern__subheading'>Ensembles et activités</h3>
          <div className='separator'></div>
          <ul>
            <li>Une classe d'orchestre</li>
            <li>Une batucada (ensemble de percussions)</li>
          </ul>
          <p className='musicSchool__details'>Ces groupes sont mis en place le mercredi après midi pour la classe d’orchestre et le jeudi soir pour la batucada et permet aux musiciens en herbe d’apprendre à jouer ensemble, sous la direction de Jérôme Dupuich. Ils sont également invités à se produire en public, pendant les concerts de l’Harmonie ou lors de manifestations particulières, auprès de nos ainés, par exemple.</p>
        </div>

        <div>
          <h3 className='pagePattern__subheading'>Informations et renseignements</h3>
          <div className='separator'></div>

          <div className='musicSchool__informations'>
            <p>
              <strong>L'école de musique est ouverte du Lundi au Samedi.</strong><br />
              <span className='musicSchool__address'>Salle Léon Urbain, École de Musique, rue Ferrer, 62750 LOOS EN GOHELLE</span>
            </p>
            <p className='musicSchool__contact'>Pour tout renseignement, veuillez nous contacter via <Link to={'/contact'} className='musicSchool__contact__color'>cette page</Link>, ou par téléphone au <strong className='musicSchool__contact__color'>03.21.28.21.05</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

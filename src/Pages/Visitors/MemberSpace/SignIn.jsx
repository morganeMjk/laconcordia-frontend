import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SignInForm from '../../../Components/Forms/SignInForm.Component';

// Page SignIn, qui permet l'affichage du formulaire "SignInForm" ainsi qu'un lien menant vers le formulaire d'inscritpion.

export default function SignIn(props) {
  const { fetchProfile } = props;
  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - Connexion</title></Helmet>

        <div id='category'>
          <h2>Connexion</h2>
          <h3>Connectez-vous à votre compte</h3>
        </div>
      <div className='signIn pagePattern__content'>
          {/* Affichage du composant SignInForm */}
          <SignInForm fetchProfile={fetchProfile} />
          <p className='signIn__details'>Pas encore inscrit ? <Link to={'/inscription'} className='signIn__details__link'>Inscrivez-vous.</Link></p>
      </div>
    </div>
  )
}

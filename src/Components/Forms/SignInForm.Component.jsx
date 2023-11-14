import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../Router';
import { toastNotification, updateToastNotification } from '../../Router';
// Composant SignInForm utilisé sur la page "SignIn".

export default function SignInForm(props) {
  const { fetchProfile } = props;
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState([])

  // Création de la fonction "verification" qui empeche le navigateur de recharger la page lors du clic sur le bouton "Se connecter" du formulaire.
  const verification = async (event) => {
    event.preventDefault()
    const userData = {
      email,
      password
    }

    setError([]);
    const newError = [];

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(userData.email)) {
      newError.push('email');
    }

    if (!userData.password) {
      newError.push('password');
    }

    setError(newError);

    if (newError.length > 0) {
      return;
    }

    const toastId = toastNotification('loading', 'Connexion en cours...')
    const response = await useApi.user.SignIn(userData);


    if (response && response.token) {
      updateToastNotification(toastId, 'success', 'Connexion réussie, redirection en cours...');

      localStorage.setItem("accessToken", response.token);
      useApi.updateAccessToken(response.token);
      const profileResponse = await fetchProfile();

      if (profileResponse) {
        navigate("/espace-membre");

        setEmail("");
        setPassword("");
      }
      
    } else {
      if (response.archived) {
        updateToastNotification(toastId, 'error', response.message);
        navigate("/contact#contactForm");
      } else if (response.isNotVerified) {
        updateToastNotification(toastId, 'error', response.message);
        navigate("/verification");
      } else {
        updateToastNotification(toastId, 'error', 'E-mail ou mot de passe incorrect');
      }
      // alert("E-mail ou mot de passe incorrect")
    }
  }

  return (
    <div>
      {/* Utilisation de la fonction "verification" lors de l'envoi du formulaire. */}
      <form method="post" onSubmit={(event) => verification(event)}>
        <fieldset className='form'>
          <div className="form__inputError">
            <input id='emailInput' style={error.includes('email') ? { border: 1 + 'px solid red' } : null} type="email" name="email" placeholder='E-mail*'
              onChange={(event) => setEmail(event.currentTarget.value)}
              value={email}
            />
            {error.includes('email') && <label htmlFor='emailInput'>Veuillez renseigner un e-mail valide</label>}
          </div>

          <div className='form__inputError'>
            <input type="password" name="password" placeholder='Mot de passe*'
              style={error.includes('password') ? { border: 1 + 'px solid red' } : null}
              onChange={(event) => setPassword(event.currentTarget.value)}
              value={password}
            />
            {error.includes('password') && <label htmlFor='passwordInput'>Veuillez renseigner un mot de passe</label>}
            <Link to='/reinitialisation-mdp' className='italicLink'>Mot de passe oublié ?</Link>
          </div>
          <button type="submit" className='greenButton'>Se connecter</button>
        </fieldset>
      </form>
    </div >
  )
}

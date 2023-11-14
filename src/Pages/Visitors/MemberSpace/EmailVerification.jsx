import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useApi } from '../../../Router';
import { toastNotification, updateToastNotification } from '../../../Router';
import { Link, useNavigate } from 'react-router-dom';

export default function EmailVerification() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState([])

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const toastId = toastNotification('loading', 'Veuillez patienter...')

        setError([]);
        const newError = [];

        if (!email) {
            newError.push('email')
        }

        const response = await useApi.user.VerifyAccount({ email, code });

        if (response.error) {
            newError.push('code')
            updateToastNotification(toastId, 'error', response.message);
        } else {
            updateToastNotification(toastId, 'success', response.message);
            navigate('/connexion');
        }

        setError(newError);

        if (newError.length > 0) {
            return;
        }
    }

    const resendVerificationCode = async () => {

        const toastId = toastNotification('loading', 'Veuillez patienter...')

        if (email === '' || email === undefined) {
            updateToastNotification(toastId, 'error', 'Veuillez renseigner votre adresse mail');
            return;
        }

        const response = await useApi.user.ResendVerificationCode({ email });

        if (response.error) {
            updateToastNotification(toastId, 'error', response.message);
            return;
        } else {
            updateToastNotification(toastId, 'success', "Un nouveau code de vérification vous a été envoyé par mail");
            return;
        }
    }
    return (
        <div className='pagePattern'>
            <Helmet><title>La Concordia - Vérification</title></Helmet>

            <div id='category'>
                <h2>Validation de votre compte</h2>
                <h3>Renseignez le code qui vous a été envoyé par mail pour valider votre compte</h3>
            </div>
            <div className='pagePattern__content'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <fieldset className='form'>
                        <div className='form__inputError'>
                            <input type="email" name="email" id="email" placeholder='Saisissez votre adresse mail' value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                        {error.includes('email') && <label>Veuillez saisir votre adresse mail</label>}
                        
                        </div>
                        <div className='form__inputError'>
                            <input type="text" name="code" id="code" placeholder='Saisissez le code de vérification' value={code} onChange={(e) => setCode(e.currentTarget.value)} />

                            {error.includes('code') && <label htmlFor="code">Le code de vérification est incorrecte ou a expiré</label>}
                        </div>

                        <Link onClick={() => resendVerificationCode()} type='button' className='italicLink'>Renvoyer un code de vérification</Link>
                        <button type='submit' className='greenButton'>Valider</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from './../../../Router';
import { toastNotification, updateToastNotification } from './../../../Router';


export default function ResetPassword() {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState([])
    const navigate = useNavigate();

    const handleForm = async (event, step) => {
        event.preventDefault();

        const toastId = toastNotification('loading', 'Veuillez patienter...')

        setError([]);
        const newError = [];
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/i;

        if (step === 1) {
            setStep(2);
            // eslint-disable-next-line
            const response = await useApi.user.ResetPassword({ email: email });
            updateToastNotification(toastId, "success", "Un code de vérification vous a été envoyé par mail");
            // console.log(response);

        } else if (step === 2) {
            const response = await useApi.user.CheckResetCode({ email: email, code: code });
            if (response.error) {

                newError.push('code')

                updateToastNotification(toastId, "error", "Le code de vérification est incorrect");
            } else {
                updateToastNotification(toastId, "success", "Vous pouvez désormais changer votre mot de passe");
                setStep(3);
            }
        } else if (step === 3) {
            if (!passwordRegex.test(password)) {
                newError.push("password");
            }

            if (password !== passwordConfirmation) {

                newError.push('confirmationPassword')

                updateToastNotification(toastId, "error", "Les mots de passe ne correspondent pas");
            } else {
                // eslint-disable-next-line
                const response = await useApi.user.UpdateResetPassword({ email: email, code: code, password: password });

                updateToastNotification(toastId, "success", "Le mot de passe a bien été modifié")
                navigate("/connexion");

                // console.log(response);
            }
        }

        setError(newError);

        if (newError.length > 0) {
            return;
        }

    }

    return (
        <div className='pagePattern'>
            <Helmet><title>La Concordia - Réinitialisation</title></Helmet>

            <div id='category'>
                <h2>Réinitialisez votre mot de passe</h2>
            </div>
            <Link to='/connexion' className='returnButton'>
                <i className="fa-solid fa-circle-up fa-rotate-270"></i>
            </Link>
            <div className='pagePattern__content'>
                {step === 1 ?
                    <form onSubmit={(e) => handleForm(e, 1)}>
                        <fieldset className='form'>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                placeholder='Saisissez votre adresse mail *'
                                required
                            />

                            <button className='greenButton saveButton'>Valider</button>
                        </fieldset>
                    </form>
                    : step === 2 ?
                        <form onSubmit={(e) => handleForm(e, 2)}>
                            <fieldset className='form'>

                                <div className='form__inputError'>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder='Saisissez votre adresse mail *'
                                        value={email}
                                        required
                                        disabled
                                    />
                                </div>

                                <div className='form__inputError'>
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.currentTarget.value)}
                                        placeholder='Saisissez le code de vérification *'
                                        required
                                    />
                                    {error.includes('code') && <label htmlFor="code">
                                        Le code de vérification est incorrecte ou a expiré.
                                    </label>}

                                </div>
                                <button className='greenButton saveButton'>Valider</button>
                            </fieldset>
                        </form>

                        : step === 3 ?
                            <form onSubmit={(e) => handleForm(e, 3)}>
                                <fieldset className='form'>
                                    <div className='form__inputError'>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder='Saisissez votre adresse mail *'
                                            value={email}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className='form__inputError'>
                                        <input
                                            type="password"
                                            id='password1'
                                            name="password1"
                                            value={password}
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                            placeholder='Nouveau mot de passe *'
                                            required
                                        />
                                        {error.includes('password') && <label htmlFor="password1">
                                            Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial.
                                        </label>}
                                    </div>

                                    <div className='form__inputError'>
                                        <input
                                            type="password"
                                            id='password2'
                                            name="password2"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.currentTarget.value)}
                                            placeholder='Confirmation *'
                                            required
                                        />
                                        {error.includes('confirmationPassword') && <label htmlFor="password2">
                                            Le mot de passe ne correspond pas.
                                        </label>}
                                    </div>
                                    <button className='greenButton saveButton'>Valider</button>
                                </fieldset>
                            </form>
                            : null}
            </div>
        </div>
    )
}

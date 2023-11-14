import React, { useState } from 'react';
import { useApi } from '../../Router';
import { useNavigate } from 'react-router-dom';
import { toastNotification, updateToastNotification } from '../../Router';
// Composant SignUpForm utlisé sur la page "SignUp"


export default function SignUpForm() {
    const navigate = useNavigate();

    // Utilisation du Hook useState pour définir les variables relatives aux champs du formulaire et leur état.
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState([])


    // Création de la fonction "verification" qui empeche le navigateur de recharger la page lors du clic sur le bouton "Se connecter" du formulaire.
    const verification = async (event) => {
        event.preventDefault()

        const userData = {
            firstName,
            lastName,
            email,
            phoneNumber: phone,
            password
        }

        setError([]);

        const nameRegex = /^[a-zA-Z]+$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/i;
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

        const newError = [];

        if (!nameRegex.test(firstName)) {
            newError.push("firstName");
        }

        if (!nameRegex.test(lastName)) {
            newError.push("lastName");
        }

        if (!emailRegex.test(email)) {
            newError.push("email");
        }

        if (!passwordRegex.test(password)) {
            newError.push("password");
        }

        if (password !== passwordConfirmation) {
            newError.push("passwordConfirmation");
        }

        if (phone) {
            if (!phoneRegex.test(phone)) {
                newError.push("phone");
            }
        }

        setError(newError);

        if (newError.length > 0) {
            return;
        }

        const toastId = toastNotification('loading', 'Veuillez patienter...');
        const response = await useApi.user.SignUp(userData);
        
        if (!response) {
            return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }
        if (response.error) {
            // console.log('Une erreur est survenue');
            if (response.message) {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }
        } else {
            updateToastNotification(toastId, 'success', 'Votre compte a bien été créé, vous devez maintenant valider votre email.')
            navigate('/verification');
        }
    }

    return (
        <div>
            <form method="post" onSubmit={(event) => verification(event)}>
                <fieldset className='form'>
                    <div className='form__box'>
                        <div className='form__inputError'>
                            <input style={error.includes("lastName") ? { border: 1 + 'px solid red' } : null}
                                type="text"
                                id='lastname'
                                name='lastname'
                                placeholder='Nom *'
                                // Lors de la modification du champs par l'utilisateur, la valeur de "lastName" est mise à jour avec les informations renseignées
                                onChange={(event) => setLastName(event.currentTarget.value)}
                                value={lastName}
                            />
                            {error.includes("lastName") && <label htmlFor="lastname">Le nom doit contenir au moins 2 caractères et ne doit pas contenir de chiffres</label>}
                        </div>

                        <div className='form__inputError'>
                            <input style={error.includes("firstName") ? { border: 1 + 'px solid red' } : null}
                                type="text"
                                id='firstname'
                                name='firstname'
                                placeholder='Prénom *'
                                // Lors de la modification du champs par l'utilisateur, la valeur de "firstName" est mise à jour avec les informations renseignées
                                onChange={(event) => setFirstName(event.currentTarget.value)}
                                value={firstName}
                            />
                            {error.includes("firstName") && <label htmlFor="firstname">Le prénom doit contenir au moins 2 caractères et ne doit pas contenir de chiffres</label>}
                        </div>
                    </div>

                    <div className='form__box'>
                        <div className='form__inputError'>
                            <input style={error.includes("email") ? { border: 1 + 'px solid red' } : null}
                                type="email"
                                id='email'
                                name='email'
                                placeholder='E-mail *'
                                // Lors de la modification du champs par l'utilisateur, la valeur de "email" est mise à jour avec les informations renseignées
                                onChange={(event) => setEmail(event.currentTarget.value)}
                                value={email}
                            />
                            {error.includes("email") && <label htmlFor="email">L'adresse email est invalide</label>}
                        </div>

                        <div className='form__inputError'>
                            <input style={error.includes("phone") ? { border: 1 + 'px solid red' } : null}
                                type="tel"
                                id='phone'
                                name='phone'
                                placeholder='Téléphone'
                                maxLength={"10"}
                                // Lors de la modification du champs par l'utilisateur, la valeur de "phone" est mise à jour avec les informations renseignées
                                onChange={(event) => setPhone(event.currentTarget.value)}
                                value={phone}
                            />
                            {error.includes("phone") && < label htmlFor="phone">Le numéro de téléphone est invalide</label>}
                        </div>
                    </div>

                    <select name="civility">
                        <option value="Civilité" disabled selected>Civilité</option>
                        <option value="Madame">Madame</option>
                        <option value="Monsieur">Monsieur</option>
                    </select>

                    <div className='form__inputError'>
                        <input style={error.includes("password") ? { border: 1 + 'px solid red' } : null}
                            type="password"
                            id='password1'
                            name="password1"
                            // Lors de la modification du champs par l'utilisateur, la valeur de "password" est mise à jour avec les informations renseignées
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            value={password}
                            placeholder='Mot de passe *'
                        />
                        {error.includes("password") && <label htmlFor="password1">Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial</label>}
                    </div>

                    <div className='form__inputError'>
                        <input style={error.includes("passwordConfirmation") ? { border: 1 + 'px solid red' } : null} type="password" id='password2' name="password2" placeholder='Confirmation *'
                            onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
                            value={passwordConfirmation}
                        />
                        {error.includes("passwordConfirmation") && <label htmlFor="password2">Le mot de passe ne correspond pas</label>}
                    </div>

                    <div className='form__checkbox' >
                        <input type="checkbox" name="newsletter" />
                        <label htmlFor="newsletter">
                            Souhaitez-vous recevoir les actualités et les évènements de La Concordia par mail
                        </label>
                    </div>

                    <button type="submit" className='greenButton'>S'inscrire</button>
                </fieldset>
            </form>
        </div >
    )
}
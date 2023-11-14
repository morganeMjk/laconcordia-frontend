import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../Router';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen.Component';
import { toastNotification, updateToastNotification } from '../../Router';
import StatusSelect from '../../Components/Select/StatusSelect.Component';
import RoleSelect from '../../Components/Select/RoleSelect.Component';
import InstrumentSelect from '../../Components/Select/InstrumentSelect.Component';

export default function UserUpdate() {

    const { id } = useParams();
    const [user, setUser] = useState({})
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState([]);
    const [allUsers, setAllUsers] = useState([])
    const [instruments, setInstruments] = useState(undefined);
    const [roles, setRoles] = useState(undefined);
    const [status, setStatus] = useState(undefined);

    const fetchAllUsers = async () => {
        const response = await useApi.user.GetAll();
        return setAllUsers(response.data);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const response = await useApi.user.GetById({ id: id });
            const { data } = response;
            setFirstName(data.firstName)
            setLastName(data.lastName)
            setEmail(data.email)
            setPhoneNumber(data.phone)
            setUser(data)
            fetchAllUsers()
        }
        const fetchRoles = async () => {
            const response = await useApi.roles.GetAll();
            return setRoles(response.data);
        }

        const fetchStatus = async () => {
            const response = await useApi.status.GetAll();
            return setStatus(response.data);
        }

        const fetchInstruments = async () => {
            const response = await useApi.instruments.GetAll();
            return setInstruments(response.data);
        }
        fetchUser()
        fetchRoles()
        fetchStatus()
        fetchInstruments()
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError([]);

        const nameRegex = /^[a-zA-Z]+$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i;
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

        if (phoneNumber) {
            if (!phoneRegex.test(phoneNumber)) {
                newError.push("phoneNumber");
            }
        }

        setError(newError);

        if (newError.length > 0) {
            return;
        }

        const toastId = toastNotification('loading', 'Veuillez patienter...');

        const response = await useApi.user.UserUpdate({ firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber, id: id })

        if (!response) {
            return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }
        if (response.error) {
            if (response.message) {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }
        } else {
            updateToastNotification(toastId, 'success', 'Le profil a bien été mis à jour.')
        }
    }

    const handleDelete = async (id, state) => {
        const response = await useApi.user.ArchiveUser({ id: id, state: state });
        // console.log(response)
        const toastId = toastNotification('loading', 'Veuillez patienter...');

        if (!response) {
            return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }
        if (response.error) {
            if (response.message) {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
                updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }
        } else {
            const newUser = await useApi.user.GetById({ id: id });
            setUser(newUser.data);
            updateToastNotification(toastId, 'success', 'Le profil a bien été mis à jour.')
        }
    }


    if (!allUsers) {
        return <LoadingScreen />
    }

    return (
        <div className='usersPage'>
            <Helmet><title>La Concordia - Gestion des utilisteurs</title></Helmet>


            {!allUsers || allUsers.length === 0 ? <LoadingScreen /> : <>
                <div id='category'>
                    <h2>Gestion des utilisateurs</h2>
                    <h3>Modification du profil de {user.firstName} {user.lastName}</h3>
                </div>

                <Link to='/espace-membre/utilisateurs' className='returnButton'>
                    <i className="fa-solid fa-circle-up fa-rotate-270"></i>
                </Link>

                <div className='profil usersPage__content'>
                    <div>
                        <h3 className='usersPage__subheading'>Informations personnelles</h3>
                        <div className='separator'></div>

                        <form onSubmit={(event) => handleSubmit(event)}>
                            <fieldset className='form'>

                                <div className='form__inputError'>
                                    <input
                                        type="text"
                                        name='lastname'
                                        value={lastName}
                                        onChange={(event) => setLastName(event.currentTarget.value)}
                                    />
                                    {error.includes("lastName") && <label htmlFor="lastname">Le nom doit contenir au moins 2 caractères et ne doit pas contenir de chiffres</label>}
                                </div>

                                <div className='form__inputError'>
                                    <input
                                        type="text"
                                        name='firstname'
                                        value={firstName}
                                        onChange={(event) => setFirstName(event.currentTarget.value)}
                                    />
                                    {error.includes("firstName") && <label htmlFor="firstame">Le prénom doit contenir au moins 2 caractères et ne doit pas contenir de chiffres</label>}
                                </div>

                                <div className='form__inputError'>
                                    <input
                                        type="email"
                                        name='email'
                                        value={email}
                                        onChange={(event) => setEmail(event.currentTarget.value)}
                                    />
                                    {error.includes("email") && <label htmlFor="firstame">L'adresse email est invalide</label>}
                                </div>

                                <div className='form__inputError'>
                                    <input
                                        type="phone"
                                        name='phoneNumber'
                                        value={phoneNumber}
                                        onChange={(event) => setPhoneNumber(event.currentTarget.value)}
                                    />
                                    {error.includes("phoneNumber") && <label htmlFor="phoneNumber">Le numéro de téléphone est invalide</label>}
                                </div>

                                <button className='greenButton saveButton'>Enregistrer</button>
                            </fieldset>
                        </form>
                    </div>

                    <RoleSelect
                        user={user}
                        userId={parseInt(id)}
                        roles={roles}
                    />
                    <StatusSelect
                        user={user}
                        userId={parseInt(id)}
                        status={status}
                    />
                    <InstrumentSelect
                        user={user}
                        userId={parseInt(id)}
                        instruments={instruments}
                    />

                </div>
                {user.deletionDate ?
                    <button className='greenButton activeButton' onClick={() => handleDelete(parseInt(id), false)}>Réactiver ce compte utilisateur</button>
                    :
                    <button className='greenButton suspendButton' onClick={() => handleDelete(parseInt(id), true)} >Susprendre ce compte utilisateur</button>
                }
            </>}
        </div >
    )
}

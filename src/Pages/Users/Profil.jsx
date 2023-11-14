import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Modal from '../../Components/Modal/Modal.Component';
import InformationsForm from '../../Components/Forms/InformationsForm.Components';
import SelectComponent from '../../Components/Forms/Select.Component';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen.Component';
import { toastNotification, updateToastNotification, useApi } from '../../Router';

export default function Profil(props) {
  const { user, notification, setNotification } = props;
  const [roles, setRoles] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [instruments, setInstruments] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [error, setError] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/i;

    const newError = [];

    if (!passwordRegex.test(newPassword)) {
      newError.push("password");
    }

    if (newPassword !== confirmationPassword) {
      newError.push("confirmationPassword");
    }

    setError(newError);

    if (newError.length > 0) {
        return;
    }

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.user.UpdatePassword({ currentPassword: currentPassword, newPassword: newPassword, confirmationPassword: confirmationPassword, email: user.email })
    console.log(response)

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
      setCurrentPassword('')
      setNewPassword('')
      setConfirmationPassword('')

      updateToastNotification(toastId, 'success', 'Le mot de passe a bien été mis à jour.')
      setShowModal(false)
    }
  }

  const handleChange = (event) => {
    setNotification(event.target.checked);
  };

  const handleNotificationUpdate = async (event) => {
    event.preventDefault();

    const toastId = toastNotification('loading', 'Veuillez patienter...');
    const response = await useApi.user.UpdateNotification({ notification: notification, email: user.email })

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
      updateToastNotification(toastId, 'success', 'Les notifications ont bien été mises à jour.')
    }
  }

  useEffect(() => {

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

    fetchRoles()
    fetchStatus()
    fetchInstruments()
  }, []);

  if (!user?.userRoles || user.length <= 0 || !Array.isArray(roles) || !Array.isArray(status) || !Array.isArray(instruments)) {
    return <LoadingScreen />
  }


  console.log(user)


  return (
    <div className='tablePage'>
      <Helmet><title>La Concordia - Mon profil</title></Helmet>

      {!user?.userRoles || user.length <= 0 || !roles || !status || !instruments ? <LoadingScreen /> :

        <>
          <div id='category'>
            <h2>Mon Profil</h2>
          </div>

          <div className='profil usersPage__content'>

            <div>
              <h3 className='usersPage__subheading'>Informations personnelles</h3>
              <div className='separator'></div>

              <div className='profil__box'>
                <InformationsForm user={user} />
                <p>Si vous souhaitez modifier vos informations, veuillez nous contacter <Link to={'/contact'} className='profil__contact'>ici</Link>.</p>
                <button onClick={() => setShowModal(true)} className='greenButton'>Modifier mon mot de passe</button>
              </div>

              <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='modal'>

                  <button className='closeButton' onClick={() => setShowModal(false)}><i className="fa-solid fa-square-xmark"></i></button>

                  <div className='modal__header'>
                    <h2 className='modal__header__title'>Modifier mon mot de passe</h2>
                  </div>

                  <div className='separator'></div>

                  <form onSubmit={handleSubmit} action="#" className='modal__form'>
                    <div>
                      <label htmlFor='password'>Mot de passe actuel</label>

                      <div>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          placeholder="*********"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password">Nouveau mot de passe</label>

                      <div className='form__inputError'>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          placeholder="*********"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.currentTarget.value)}
                        />

                        {error.includes('password') ? <label htmlFor="password">Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial</label> : null}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password">Confirmer le mot de passe</label>

                      <div className='form__inputError'>
                        <input
                          type="password"
                          name="confirmationPassword"
                          id="confirmationPassword"
                          placeholder="*********"
                          value={confirmationPassword}
                          onChange={(event) => setConfirmationPassword(event.currentTarget.value)}
                        />

                        {error.includes('confirmationPassword') ? <label htmlFor="confirmationPassword">Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial</label> : null}
                      </div>
                    </div>

                    <button type="submit" className='greenButton saveButton'>Enregistrer</button>
                  </form>
                </div>
              </Modal>
            </div>

            <div>
              <h3 className='usersPage__subheading'>Accès réglementé</h3>
              <div className='separator'></div>

              <div className='profil__box'>
                <SelectComponent readonly={true} options={user.userRoles} userData={user.userRoles} />
                <SelectComponent readonly={true} options={status} userData={user.userStatus} />
                <SelectComponent readonly={true} options={instruments} userData={user.userInstruments} />

                <p>Pour réaliser votre demande d'accès, veuillez nous contacter <Link to={'/contact'} className='profil__contact'>ici</Link>.</p>
              </div>
            </div>

            <div>
              <h3 className='usersPage__subheading'>Notifications</h3>
              <div className='separator'></div>

              <form onSubmit={handleNotificationUpdate}>
                <div className='notifications profil__box'>
                  <input
                    type="checkbox"
                    name="checkbox"
                    id="checkbox"
                    className='checkbox'
                    checked={notification}
                    value={notification}
                    onChange={handleChange}
                  />

                  <label htmlFor="checkbox">Je souhaites recevoir les actualités et les évènements de La Concordia par mail.</label>
                </div>

                <button type='submit' className='greenButton saveButton'>Mettre à jour</button>

              </form>
            </div>
          </div>
        </>}
    </div>
  )
}
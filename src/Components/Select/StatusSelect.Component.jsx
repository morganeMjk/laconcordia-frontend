import React, { useState } from 'react'
import SelectComponent from '../../Components/Forms/Select.Component';
import { useApi } from '../../Router';
import { toastNotification, updateToastNotification } from '../../Router';


export default function StatusSelect(props) {

  const { user, userId, status } = props;

  const currentStatusId = user.userStatus.map((statusObj) => statusObj.id);
  const [newStatus, setNewStatus] = useState([])
  const newStatusId = newStatus.map((statusObjId) => statusObjId.id)

  const handleStatusSubmit = (event) => {
    event.preventDefault();

    const statusToAdd = [];
    const statusToRemove = [];

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    currentStatusId.map(async (statusId) => {
      if (!newStatusId.includes(statusId)) {
        statusToRemove.push(statusId);

        const response = await useApi.userStatus.Delete({ userId: userId, statusId: statusId })
        
        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (currentStatusId[currentStatusId.length - 1] === statusId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Le status de l\'utilisateur a bien été modifié.')
          }
        }
        return;
      }
    });

    newStatusId.map(async (statusId) => {
      if (!currentStatusId.includes(statusId)) {

        statusToAdd.push(statusId);

        const response = await useApi.userStatus.Create({ userId: userId, statusId: statusId })

        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (newStatusId[newStatusId.length - 1] === statusId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Le status de l\'utilisateur a bien été modifié.')
          }
        }
        return;
      }

    });
  }


  return (
    <div>
      <form onSubmit={handleStatusSubmit}>
        <h3 className='usersPage__subheading'>Status</h3>
        <div className='separator'></div>
        <fieldset className='form'>
          <SelectComponent
            options={status}
            userData={user.userStatus}
            onChange={(event) => setNewStatus(event)}
          />
          <button className='greenButton saveButton'>Enregistrer</button>
        </fieldset>
      </form>
    </div>
  )
}

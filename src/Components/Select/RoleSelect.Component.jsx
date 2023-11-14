import React, { useState } from 'react'
import SelectComponent from '../../Components/Forms/Select.Component';
import { useApi } from '../../Router';
import { toastNotification, updateToastNotification } from '../../Router';


export default function RoleSelect(props) {
  const { user, userId, roles } = props;

  const currentRolesId = user.userRoles.map((rolesObj) => rolesObj.id);
  const [newRoles, setNewRoles] = useState([])
  const newRolesId = newRoles.map((rolesObjId) => rolesObjId.id)

  // console.log(`roles actuels : ${currentRolesId}`)
  // console.log(`nouveaux roles : ${newRolesId}`)

  const handleRolesSubmit = (event) => {
    event.preventDefault();

    const rolesToAdd = [];
    const rolesToRemove = [];

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    currentRolesId.map(async (roleId) => {
      if (!newRolesId.includes(roleId)) {
        rolesToRemove.push(roleId);

        const response = await useApi.userRoles.Delete({ userId: userId, roleId: roleId })
        
        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (currentRolesId[currentRolesId.length - 1] === roleId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Le rôle de l\'utilisateur a bien été modifié.')
          }
        }
        return;
      }
    });

    // console.log(`À supprimer : ${rolesToRemove}`)


    newRolesId.map(async (roleId) => {
      if (!currentRolesId.includes(roleId)) {

        rolesToAdd.push(roleId);

        const response = await useApi.userRoles.Create({ userId: userId, roleId: roleId })

        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (newRolesId[newRolesId.length - 1] === roleId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Le rôle de l\'utilisateur a bien été modifié.')
          }
        }
        // console.log(`À ajouter : ${rolesToAdd}`)
        return;
      }



    });
  }


  return (
    <div>
      <form onSubmit={handleRolesSubmit}>
        <h3 className='usersPage__subheading'>Rôles</h3>
        <div className='separator'></div>
        <fieldset className='form'>
          <SelectComponent
            options={roles}
            userData={user.userRoles}
            onChange={(event) => setNewRoles(event)}
          />
          <button className='greenButton saveButton'>Enregistrer</button>
        </fieldset>
      </form>

    </div>
  )
}

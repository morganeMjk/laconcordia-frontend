import React, { useState } from 'react'
import SelectComponent from '../../Components/Forms/Select.Component';
import { useApi } from '../../Router';
import { toastNotification, updateToastNotification } from '../../Router';

export default function InstrumentSelect(props) {
  const { user, userId, instruments } = props;

  const currentInstrumentsId = user.userInstruments.map((instrumentsObj) => instrumentsObj.id);
  const [newInstruments, setNewInstruments] = useState([])
  const newInstrumentsId = newInstruments.map((instrumentsObjId) => instrumentsObjId.id)

  const handleInstrumentsSubmit = (event) => {
    event.preventDefault();

    const instrumentsToAdd = [];
    const instrumentsToRemove = [];

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    currentInstrumentsId.map(async (instrumentId) => {
      if (!newInstrumentsId.includes(instrumentId)) {
        instrumentsToRemove.push(instrumentId);

        const response = await useApi.userInstruments.Delete({ userId: userId, instrumentId: instrumentId })

        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (currentInstrumentsId[currentInstrumentsId.length - 1] === instrumentId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Les instruments de l\'utilisateur ont bien été modifiés.')
          }
        }
        return;
      }
    });

    newInstrumentsId.map(async (instrumentId) => {
      if (!currentInstrumentsId.includes(instrumentId)) {

        instrumentsToAdd.push(instrumentId);

        const response = await useApi.userInstruments.Create({ userId: userId, instrumentId: instrumentId })

        if (!response) {
          return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
        }

        if (newInstrumentsId[newInstrumentsId.length - 1] === instrumentId) {
          if (response.error) {
            if (response.message) {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
            } else {
              updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
            }

          } else {
            updateToastNotification(toastId, 'success', 'Les instruments de l\'utilisateur ont bien été modifiés.')
          }
        }
        return;
      }

    });
  }

  return (
    <div>
      <form onSubmit={handleInstrumentsSubmit}>
        <h3 className='usersPage__subheading'>Instruments pratiqués</h3>
        <div className='separator'></div>
        <fieldset className='form'>
          <SelectComponent
            options={instruments}
            userData={user.userInstruments}
            onChange={(event) => setNewInstruments(event)}
          />
          <button className='greenButton saveButton'>Enregistrer</button>
        </fieldset>
      </form>
    </div>
  )
}

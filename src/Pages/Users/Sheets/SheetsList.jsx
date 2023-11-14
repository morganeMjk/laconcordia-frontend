import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toastNotification, updateToastNotification } from '../../../Router';

import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';


// Page SheetsList qui renvoi la liste des partitions déjà créées.

export default function SheetsList() {


  const [sheets, setSheets] = useState([])
  const [instruments, setInstruments] = useState([])

  const [noData, setNoData] = useState(false);

  const fetchSheets = async () => {
    const response = await useApi.sheets.GetAll();

    if (response.data.length <= 0) {
      setNoData(true);
    }

    return setSheets(response.data);
  }

  const fetchInstruments = async () => {
    const response = await useApi.instruments.GetAll();
    return setInstruments(response.data);
  }

  useEffect(() => {
    fetchSheets()
    fetchInstruments()
  }, []);



  const handleDelete = async (id) => {
    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.sheets.Delete({ id: id });
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
      updateToastNotification(toastId, 'success', 'La partition a bien été supprimée.')
      fetchSheets()
    }
  }

  return (
    <div className='tablePage'>
      <Helmet><title>La Concordia - Partitions</title></Helmet>

      <div id='category'>
        <h2>Partitions</h2>
        <h3>Modifiez ou supprimez une partition</h3>
      </div>

      <Link to='/espace-membre/partitions/creation' className='link add'><button className='greenButton'>Ajouter une nouvelle partition</button></Link>

      {noData ? <p>Aucune partition à afficher</p> : instruments.length <= 0 || sheets.length <= 0 ? <MainLoadingScreen /> :
        <>
          <div className='tablePage__content'>

            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Artiste</th>
                  <th>Instruments</th>
                  <th>Partition</th>
                </tr>
              </thead>

              <tbody>
                {sheets.map((sheet, key) => {
                  const instrument = instruments.find((item) => item.id === sheet.instrumentId);
                  return (
                    <tr key={key}>
                      <td>{sheet.title}</td>
                      <td>{sheet.artist}</td>
                      <td>{instrument ? instrument.label : ''}</td>



                      <td className='buttonCell'>
                        <Link to={`/espace-membre/partitions/gestion/${sheet.id}`} className="button buttonLink">
                          <button className='tableButton'>
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                        </Link>


                        <button className='tableButton button--red' onClick={() => {
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
                            handleDelete(sheet.id);
                          }
                        }}><i className="fa-solid fa-xmark"></i></button>


                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>}



    </div>
  )
}
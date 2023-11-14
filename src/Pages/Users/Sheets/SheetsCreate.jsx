import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toastNotification, updateToastNotification } from '../../../Router';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Link, useNavigate } from 'react-router-dom';


// Page SheetsCreate qui affiche le formulaire de création d'une nouvelle partition.

export default function SheetsCreate() {

  const [title, setTitle] = useState("");
  const [sheetFile, setSheetFile] = useState(null);
  const [instrumentId, setInstrumentId] = useState("");
  const [artist, setArtist] = useState("");
  const [error, setError] = useState([]);
  const [instruments, setInstruments] = useState([])

  const navigate = useNavigate();



  const fetchInstruments = async () => {
    const response = await useApi.instruments.GetAll();

    return setInstruments(response.data);
  }

  useEffect(() => {
    fetchInstruments()
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    let newError = [];

    if (!title || title.length < 3) {
      newError.push('title');
    }

    if (!artist || artist.length < 3) {
      newError.push('artist');
    }

    if (instrumentId === "") {
      newError.push('instruments');
    }

    if (!sheetFile) {
      newError.push('sheetFile');
    }

    if (newError.length > 0) {
      // console.log('Formulaire non envoyé')
      // console.log(newError)
      return setError(newError);
    } else {

      const toastId = toastNotification('loading', 'Veuillez patienter...');

      const response = await useApi.sheets.Create({ title: title, artist: artist, instrumentId: instrumentId, sheetFile: sheetFile })

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
        updateToastNotification(toastId, 'success', 'La partition a bien été créée.')
        navigate('/espace-membre/partitions/gestion', { replace: true });
      }
    };
  }

  return (
    <div className='usersPage'>

      <Helmet><title>La Concordia - Partitions</title></Helmet>

      <div id='category'>
        <h2>Partitions</h2>
        <h3>Ajouter une nouvelle partition</h3>
      </div>

      <Link to='/espace-membre/partitions/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        <form action="post" className='form createForm' onSubmit={(event) => handleSubmit(event)}>

          <label
            htmlFor="title" className='usersPage__subheading'>
            Titre de la partition
          </label>

          <div className='form__inputError'>
            <input
              type="text"
              name="title"
              id="title"
              placeholder='Ajouter un titre'
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />

            {error.includes('title') ? <label htmlFor="title">Le titre doit contenir 3 caractères minimum</label> : null}
          </div>

          <label
            htmlFor="artist" className='usersPage__subheading'>
            Artiste
          </label>

          <div className='form__inputError'>
            <input
              type="text"
              name="artist"
              id="artist"
              placeholder="Saisir le nom de l'artiste"
              value={artist}
              onChange={(event) => setArtist(event.currentTarget.value)}
            />

            {error.includes('artist') ? <label htmlFor="artist">Le nom de l'artiste doit contenir 3 caractères minimum</label> : null}
          </div>

          <label
            htmlFor="instruments"
            className='usersPage__subheading'>
            Instrument
          </label>

          <div className='form__inputError'>
            <select
              name="instruments"
              id="instruments"
              onChange={(event) => setInstrumentId(event.currentTarget.value)}
            >
              <option value="Selectionner un instrument" disabled selected>
                Selectionner un instrument
              </option>
              {instruments.map((instrument, index) => {
                return <option key={index} value={instrument.id}>{instrument.label}</option>
              })}
            </select>

            {error.includes('instruments') ? <label htmlFor="instruments">Veillez selectionner un instrument</label> : null}
          </div>


          <label
            htmlFor="sheetFile"
            className='greenButton button importButton'>
            Importer
          </label>

          <div className='form__inputError'>
            <input
              type="file"
              // Le champs autorise uniquement les pdf
              accept=".pdf"
              // Taille maximum de l'image : 10Mo
              max-size="10000000"
              name="sheetFile"
              id='sheetFile'
              className='downloadInput'
              onChange={(event) => {
                // console.log(event.currentTarget.files)
                const format = event.currentTarget.files[0].type;
                if (format !== 'application/pdf') {
                  return toastNotification('error', 'Le fichier doit être au format PDF.');
                } else {
                  return setSheetFile(event.target.files[0])
                }
              }}
            />
            {error.includes('sheetFile') ? <label htmlFor="sheetFile">Veuillez importer le fichier PDF de la partition</label> : null}

          </div>

          {sheetFile ?
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                  height: '600px',
                  padding: '20px 0px',
                }}
              >
                <Viewer
                  fileUrl={URL.createObjectURL(sheetFile)}
                />
              </div>
            </Worker>
            : null}


          <button className='greenButton saveButton'>Enregistrer</button>

        </form>
      </div>
    </div>
  )
}

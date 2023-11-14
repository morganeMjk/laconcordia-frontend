import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen.Component';
import { toastNotification, updateToastNotification } from '../../../Router';
import { useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';

export default function SheetsUpdate() {

  const { id } = useParams();
  const [sheet, setSheet] = useState({});
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [instrumentId, setInstrumentId] = useState(null);
  const [sheetFile, setSheetFile] = useState(null);
  // eslint-disable-next-line
  const [newSheetFile, setNewSheetFile] = useState(null);
  const [instruments, setInstruments] = useState([])
  const [error, setError] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      const result = await useApi.sheets.GetById({ id: id });
      const { data } = result;
      setTitle(data.title);
      setArtist(data.artist);
      setInstrumentId(data.instrumentId);
      setSheetFile(data.sheetFile);
      setSheet(data);
    }
    const fetchInstruments = async () => {
      const response = await useApi.instruments.GetAll();

      return setInstruments(response.data);
    }
    fetchData();
    fetchInstruments();
            // eslint-disable-next-line
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    const newError = [];

    if (title.length < 3) {
      newError.push('title');
    }

    if (artist.length < 3) {
      newError.push('artist');
    }

    if (!sheetFile) {
      newError.push('sheetFile')
    }

    if (newError.length > 0) {
      setError(newError);
      return;
    }

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.sheets.Update({ title: title, artist: artist, instrumentId: instrumentId, sheetFile: newSheetFile || sheetFile, id: id })

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
      updateToastNotification(toastId, 'success', 'La partition a bien été édité.')
      navigate('/espace-membre/partitions/gestion', { replace: true });
    }
  }


  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Partitions</title></Helmet>

      <div id='category'>
        <h2>Modification de la partition "{title}"</h2>
      </div>

      <Link to='/espace-membre/partitions/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        {sheet.length <= 0 || !instruments ? <LoadingScreen /> : <>

          <form onSubmit={(event) => handleSubmit(event)}>
            <fieldset className='form'>
              <div className='form createForm'>

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
                    onChange={(event) => setTitle(event.currentTarget.value)} />

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
                    value={artist}
                    onChange={(event) => setArtist(event.currentTarget.value)} />

                  {error.includes('artist') ? <label htmlFor="title">Le nom de l'artiste doit contenir 3 caractères minimum</label> : null}
                </div>

                <label
                  htmlFor="instruments"
                  className='usersPage__subheading'>
                  Instrument
                </label>

                <select
                  name="instruments"
                  id="instruments"
                  onChange={(event) => setInstrumentId(event.currentTarget.value)}>

                  {instruments.map((instrument, key) => {
                    return <option
                      key={key}
                      value={instrument.id}
                      selected={instrumentId === instrument.id}>
                      {instrument.label}
                    </option>
                  })}
                </select>


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
                    }} />

                  {error.includes('sheetFile') ? <label htmlFor="sheetFile">Veuillez ajouter un fichier PDF de la partition</label> : null}
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
                      <Viewer fileUrl={newSheetFile ? URL.createObjectURL(newSheetFile) : `${useApi.baseUrl}/images/${sheetFile}`} />
                    </div>
                  </Worker>
                  : null}

                <button className='greenButton saveButton'>Enregistrer</button>

              </div>
            </fieldset>
          </form>
        </>}
      </div>
    </div>
  )
}

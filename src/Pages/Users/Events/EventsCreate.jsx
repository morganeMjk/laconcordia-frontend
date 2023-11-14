import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';

import 'react-quill/dist/quill.snow.css'; // Importez le thème "snow" par défaut
import ReactQuill, { Quill } from 'react-quill';
import { toastNotification, updateToastNotification } from '../../../Router';
import { Link, useNavigate } from 'react-router-dom';

import ImageCompress from 'quill-image-compress';

Quill.register({
  'modules/imageCompress': ImageCompress,
}, true);

export default function EventsCreate() {

  const [title, setTitle] = useState('');
  const [medias, setMedias] = useState(null);
  const [eventDate, setEventDate] = useState('');
  const [richContent, setRichContent] = useState('');
  const [error, setError] = useState([]);
  const [isNotified, setIsNotified] = useState(false);

  const navigate = useNavigate();

  const handleRichContentChange = (eventContent) => {
    setRichContent(eventContent);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    let newError = [];

    if (!title || title.length < 3) {
      newError.push('title');
    }

    if (!eventDate) {
      newError.push('eventDate')
    }

    if (!medias) {
      newError.push('medias');
    }

    if (!richContent || richContent.length < 12) {
      newError.push('richContent');
    }

    if (newError.length > 0) {
      // console.log('Formulaire non envoyé')
      // console.log(newError)
      return setError(newError);
    } else {

      const toastId = toastNotification('loading', 'Veuillez patienter...');

      const response = await useApi.events.Create({ title: title, content: richContent, eventDate: eventDate, thumbnail: medias, isNotified: isNotified })

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
        updateToastNotification(toastId, 'success', 'L\'article a bien été créé.')
        navigate('/espace-membre/evenements/gestion', { replace: true });
      }
    };
  }

  const Editor = {
    modules: {
      toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
      imageCompress: {
        quality: 0.7, // default
        maxWidth: 1000, // default
        maxHeight: 1000, // default
        imageType: 'image/jpeg', // default
        debug: false, // default
        suppressErrorLogging: false, // default
        insertIntoEditor: undefined, // default
        include: ['image/jpeg', 'image/jpg', 'image/png'], // default
      },
    },
    formats: [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video'
    ],
  };

  const handleMediasChange = (event, type) => {
    // console.log(event.target)
    const format = event.target.files[0].type;

    if (!format.split("/").includes('image')) {
      return toastNotification('error', 'Le format de l\'image n\'est pas valide.');
    }
    return setMedias(event.target.files[0]);
  }

  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Évenement</title></Helmet>

      <div id='category'>
        <h2>Évenement</h2>
        <h3>Création d'un nouvel évènement</h3>
      </div>

      <Link to='/espace-membre/evenements/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>
        <form onSubmit={(event) => handleSubmit(event)} className='form createForm'>

          <label htmlFor="title"
            className='usersPage__subheading'>
            Titre de l'évènement
          </label>

          <div className='form__inputError'>
            <input
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
              type="text"
              name='title'
              id='title'
              placeholder='Ajouter le titre' />

            {error.includes('title') ? <label htmlFor="title">Le titre doit contenir 3 caractères minimum</label> : null}
          </div>

          <label
            htmlFor="date"
            className='usersPage__subheading'>
            Date de l'évènement
          </label>

          <div className='form__inputError'>
            <input
              value={eventDate}
              onChange={(event) => setEventDate(event.currentTarget.value)}
              type="datetime-local"
              name='eventDate'
              id='date' />

            {error.includes('title') ? <label htmlFor="title">Le titre doit contenir 3 caractères minimum</label> : null}
          </div>

          <label
            htmlFor="content"
            className='usersPage__subheading'>
            Descriptif de l'évènement
          </label>

          <ReactQuill id="content"
            theme="snow"
            modules={Editor.modules}
            formats={Editor.formats}
            value={richContent}
            onChange={handleRichContentChange}
          />

          <div className='form__inputError'>
            {error.includes('richContent') ? <label htmlFor="richContent">Le contenu de votre article doit contenir 5 caractères minimum</label> : null}
          </div>

          <label
            htmlFor="download"
            className='greenButton button importButton'>
            Ajouter une photo pour illustrer votre évènement
          </label>

          <div className='form__inputError'>
            <input
              type="file"
              // Le champs autorise uniquement les images
              accept="image/*"
              // Taille maximum de l'image : 10Mo
              max-size="10000000"
              name="download"
              id='download'
              className='downloadInput'
              onChange={handleMediasChange} />

            {error.includes('medias') ? <label htmlFor="download">Veuillez ajouter une photo de couverture</label> : null}
          </div>

          {medias ? <img src={URL.createObjectURL(medias)} alt="Couverture" className='downloadImage' /> : medias ? <img src={`${useApi.baseUrl}/images/${medias}`} alt="Couverture" className='downloadImage' /> : null}

          <div className='notificationContainer'>
            <input
              type="checkbox"
              name="isNotified"
              id="isNotified"
              className='notificationCheckbox'
              onChange={(event) => setIsNotified(event.currentTarget.checked)}
            />

            <label
              htmlFor="isNotified">
              Notifier les utilisateurs de la l'organisation d'un nouvel évènement
            </label>
          </div>

          <button className='greenButton saveButton'>Enregistrer</button>
        </form>
      </div>
    </div>
  )
}

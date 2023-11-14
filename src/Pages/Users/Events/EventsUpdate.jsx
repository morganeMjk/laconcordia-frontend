import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen.Component';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css'; // Importez le thème "snow" par défaut
import ReactQuill, { Quill } from 'react-quill';
import { toastNotification, updateToastNotification } from '../../../Router';
import { useNavigate } from 'react-router-dom';
import ImageCompress from 'quill-image-compress';

Quill.register({
  'modules/imageCompress': ImageCompress,
}, true);

export default function EventsUpdate() {

  const { id } = useParams();
  const [events, setEvents] = useState({});
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [richContent, setRichContent] = useState('');
  const [medias, setMedias] = useState(null);
  const [error, setError] = useState([]);
  const [showedImage, setShowedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await useApi.events.GetById({ id: id });
      const { data } = result;
      setTitle(data.title);
      setEventDate(data.eventDate);
      setRichContent(data.content);
      setShowedImage(data.thumbnail)
      setEvents(data);
    }
    fetchData();
    // eslint-disable-next-line
  }, [])

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    const newError = [];


    if (title.length < 3) {
      newError.push('title');
    }

    if (!eventDate) {
      newError.push('eventDate')
    }

    if (richContent.length < 12) {
      newError.push('richContent')
    }

    if (!showedImage) {
      newError.push('thumbnail')
    }

    if (newError.length > 0) {
      setError(newError);
      return;
    }

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.events.Update({ title: title, eventDate: eventDate, content: richContent, thumbnail: medias === null || medias === showedImage ? null : medias, id: id })

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
      updateToastNotification(toastId, 'success', 'L\'article a bien été édité.')
      navigate('/espace-membre/evenements/gestion', { replace: true });
    }
  }

  const handleRichContentChange = (value) => {
    setRichContent(value);
  }


  const handleMediasChange = (event, type) => {
    // console.log(event.target)
    const format = event.target.files[0].type;

    if (!format.split("/").includes('image')) {
      return toastNotification('error', 'Le format de l\'image n\'est pas valide.');
    }
    return setMedias(event.target.files[0]);
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

  const formattedDate = moment(eventDate).format('YYYY-MM-DDTHH:mm');


  console.log(richContent)


  const handleDelete = async (id) => {
    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.events.Delete({ id: id });
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
      updateToastNotification(toastId, 'success', 'L\'évènement a bien été supprimé.')
      navigate('/espace-membre/evenements/gestion', { replace: true });
    }
  }





  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Évènements</title></Helmet>

      <div id='category'>
        <h2>Modification de l'évènement "{events.title}"</h2>
      </div>

      <Link to='/espace-membre/evenements/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        {events.length <= 0 || !events.title ? <LoadingScreen /> : <>

          <form onSubmit={(event) => handleSubmit(event)}>
            <fieldset className='form'>
              <div className='form createForm'>

                <label
                  htmlFor="title"
                  className='usersPage__subheading'>
                  Titre de l'article
                </label>

                <div className='form__inputError'>
                  <input
                    type="text"
                    name='title'
                    id='title'
                    placeholder={"Ajouter le titre"}
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                  />

                  {error.includes('title') ? <label htmlFor="title">Le titre doit contenir 3 caractères minimum</label> : null}
                </div>

                <label
                  htmlFor="eventDate"
                  className='usersPage__subheading'>
                  Date de l'évènement
                </label>

                <div className='form__inputError'>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    id="eventDate"
                    value={formattedDate}
                    onChange={(event) => setEventDate(event.currentTarget.value)}
                  />

                  {error.includes('eventDate') ? <label htmlFor="eventDate">Veuillez selectionner une date valide</label> : null}
                </div>

                <label
                  htmlFor="content"
                  className='usersPage__subheading'>
                  Contenu de l'article
                </label>

                <ReactQuill
                  id="richContent"
                  theme="snow"
                  modules={Editor.modules}
                  formats={Editor.formats}
                  value={richContent}
                  onChange={handleRichContentChange} />

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
                    onChange={handleMediasChange}
                  />

                  {error.includes('thumbnail') ? <label htmlFor="download">Veuillez ajouter une photo de couverture</label> : null}
                </div>

                {medias ? <img src={URL.createObjectURL(medias)} alt="Médias de l'article" className='downloadImage' /> : showedImage ? <img src={`${useApi.baseUrl}/images/${showedImage}`} alt="Médias de l'article" className='downloadImage' /> : null}

                <button className='greenButton sendButton'>Mettre à jour</button>
              </div>
            </fieldset>
          </form>
        </>}

        <button className='greenButton deletedButton' onClick={() => {
          if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
            handleDelete(id);
          }
        }}>Supprimer l'évènement</button>
      </div>
    </div>
  )
}

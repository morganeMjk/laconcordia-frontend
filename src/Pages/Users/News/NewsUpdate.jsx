import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen.Component';
import 'react-quill/dist/quill.snow.css'; // Importez le thème "snow" par défaut
import ReactQuill, { Quill } from 'react-quill';
import { toastNotification, updateToastNotification } from '../../../Router';
import { useNavigate } from 'react-router-dom';
import ImageCompress from 'quill-image-compress';

Quill.register({
  'modules/imageCompress': ImageCompress,
}, true);

export default function NewsUpdate() {

  const { id } = useParams();
  const [news, setNews] = useState({});
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [richContent, setRichContent] = useState('');
  const [medias, setMedias] = useState(null);
  const [error, setError] = useState([]);
  const [showedImage, setShowedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await useApi.news.GetById({ id: id });
      const { data } = result;
      setDescription(data.description);
      setTitle(data.title);
      setRichContent(data.content);
      setShowedImage(data.thumbnail)
      setNews(data);
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

    if (description.length < 3) {
      newError.push('description');
    }

    if (richContent.length < 12) {
      newError.push('richContent')
    }

    if (newError.length > 0) {
      setError(newError);
      return;
    }

    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.news.Update({ title: title, description: description, content: richContent, thumbnail: medias === null || medias === showedImage ? null : medias, id: id })

    if (!response) {
      return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
    }
    if (response.error) {
      // console.log('Une erreur est survenue');
      if (response.message) {
        updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + response.message + '.')
      } else {
        updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
      }
    } else {
      updateToastNotification(toastId, 'success', 'L\'article a bien été édité.')
      navigate('/espace-membre/actualites/gestion', { replace: true });
    }

  }

  const handleRichContentChange = (value) => {
    setRichContent(value);
  }

  const handleMediasChange = (event) => {
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

  const handleDelete = async (id) => {
    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.news.Delete({ id: id });
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
      updateToastNotification(toastId, 'success', 'L\'actualité a bien été supprimée.')
      navigate('/espace-membre/actualites/gestion', { replace: true });
    }
  }



  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Actualié</title></Helmet>

      <div id='category'>
        <h2>Modification de l'actualité "{news.title}"</h2>
      </div>

      <Link to='/espace-membre/actualites/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        {news.length <= 0 || !news.title ? <LoadingScreen /> : <>
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
                    placeholder={"Ajouter le titre"}
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                  />

                  {error.includes('title') ? <label htmlFor="title">Le titre doit contenir 3 caractères minimum</label> : null}
                </div>

                <label
                  htmlFor="description"
                  className='usersPage__subheading'>
                  Description courte
                </label>

                <div className='form__inputError'>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.currentTarget.value)}
                    name="description"
                    id="description"
                    placeholder='Ajouter une description courte, exemple : "Bienvenue sur notre site !"'>
                  </textarea>

                  {error.includes('description') ? <label htmlFor="description">La desccription doit contenir 3 caractères minimum</label> : null}
                </div>

                <label
                  htmlFor="content"
                  className='usersPage__subheading'>
                  Contenu de l'article
                </label>

                <ReactQuill
                  id="content"
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
                  Modifier la photo pour illustrer votre évènement
                </label>

                <input
                  type="file"
                  // Le champs autorise uniquement les images et les vidéos
                  accept="image/*"
                  // Taille maximum de l'image : 10Mo
                  max-size="10000000"
                  name="download"
                  id='download'
                  className='downloadInput'
                  onChange={handleMediasChange}
                />

                {medias ? <img src={URL.createObjectURL(medias)} alt="Couverture" className='downloadImage' /> : showedImage ? <img src={`${useApi.baseUrl}/images/${showedImage}`} alt="Couverture" className='downloadImage' /> : null}

                <button className='greenButton sendButton'>Mettre à jour</button>
              </div>
            </fieldset>
          </form>
        </>}


        <button className='greenButton deletedButton' onClick={() => {
          if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
            handleDelete(id);
          }
        }}>Supprimer l'album</button>


      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import { Link, useNavigate } from 'react-router-dom';
import { toastNotification, updateToastNotification } from '../../../Router';


export default function AlbumsCreate() {

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState([]);
  const [medias, setMedias] = useState([]);
  const [albumId, setAlbumId] = useState(null)
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError([]);

    let newError = [];

    if (!title || title.length < 3) {
      newError.push('title');
    }

    if (!thumbnail) {
      newError.push('thumbnail');
    }

    if (newError.length > 0) {
      // console.log('Formulaire non envoyé')
      // console.log(newError)
      return setError(newError);
    } else {

      const toastId = toastNotification('loading', 'Veuillez patienter...');

      const response = await useApi.albums.Create({ title: title, thumbnail: thumbnail })

      await setAlbumId(response.id.albumId)

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
        updateToastNotification(toastId, 'success', 'L\'album a bien été créé.')
        setStep(2)
      }
    };
  }

  const handleCoverPhoto = (event, type) => {
    const format = event.target.files[0].type;

    if (!format.split("/").includes('image')) {
      return toastNotification('error', 'Le format de l\'image n\'est pas valide.');
    }
    return setThumbnail(event.target.files[0]);
  }


  const handleMedias = (event) => {
    const files = Array.from(event.target.files);
    // Si un des fichiers n'est pas une image, on ne l'ajoute pas au tableau
    const filesToAdd = files.filter(file => file.type.split("/").includes('image') || file.type.split("/").includes('video'))

    setMedias(filesToAdd)
  }

  const handleMediasSubmit = async (event) => {
    event.preventDefault();

    setError([]);
    let newError = [];

    const formData = new FormData();

    medias.forEach((media, index) => {
      formData.append(`medias`, media);
    });

    formData.append('albumId', albumId)

    if (medias.length === 0) {
      newError.push('medias');
    }

    if (newError.length > 0) {
      // console.log('Formulaire non envoyé')
      // console.log(newError)
      return setError(newError);
    } else {

      const toastId = toastNotification('loading', 'Veuillez patienter...');

      const response = await useApi.medias.Create(formData)
      
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
        setMedias([])
        updateToastNotification(toastId, 'success', 'Les médias ont bien été importés.')
        navigate('/espace-membre/medias/gestion', { replace: true });
      }
    };
  }





  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Galerie médias</title></Helmet>

      <div id='category'>
        <h2>Médias</h2>
        <h3>Création d'un nouvel album</h3>
      </div>

      <Link to='/espace-membre/medias/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        {step === 1 ?

          <form onSubmit={(event) => handleSubmit(event)} className='form createForm'>

            <label
              htmlFor="title"
              className='usersPage__subheading'>
              Titre de l'album
            </label>

            <div className="form__inputError">
              <input
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                type="text"
                name='title'
                placeholder='Ajouter le titre'
              />

              {error.includes('title') && <label htmlFor='title'>Veuillez renseigner un titre</label>}
            </div>

            <label
              htmlFor="download"
              className='greenButton button importButton'>
              Ajouter une photo de couverture
            </label>

            <div className="form__inputError">
              <input
                type="file"
                // Le champs autorise uniquement les images
                accept="image/*"
                // Taille maximum de l'image : 10Mo
                max-size="10000000"
                name="download"
                id='download'
                className='downloadInput'
                onChange={handleCoverPhoto}
              />

              {error.includes('thumbnail') && <label htmlFor='download'>Veuillez ajouter une photo de couverture</label>}
            </div>

            {thumbnail ? <img src={URL.createObjectURL(thumbnail)} alt="Médias de l'article" className='downloadImage' /> : thumbnail ? <img src={`${useApi.baseUrl}/images/${thumbnail}`} alt="Medias de l'article" className='downloadImage' /> : null}

            <button className='greenButton saveButton'>Créer l'album</button>

          </form>

          : step === 2 ?

            <form onSubmit={(event) => handleMediasSubmit(event)} className='form createForm'>

              <label
                htmlFor="title"
                className='usersPage__subheading'>
                Titre de l'album
              </label>

              <input
                value={title}
                disabled
                type="text"
                name='title'
                placeholder='Ajouter le titre'
              />

              <label
                htmlFor="medias"
                className='greenButton button importButton'>
                Importer les médias
              </label>

              <div className="form__inputError">
                <input
                  type="file"
                  // Le champs autorise uniquement les images et les vidéos
                  accept="image/*,video/*"
                  // Taille maximum de l'image : 1Go
                  max-size="1000000000"
                  name='medias'
                  id='medias'
                  multiple
                  className='downloadInput'
                  onChange={handleMedias}
                />

                {error.includes('medias') && <label htmlFor='medias'>Veuillez ajouter des médias</label>}
              </div>

              <div className='updateCardsContainer'>
                {medias.map((media, key) => (
                  <div key={key} className='importedMediaItem mediasCard'>
                    {media.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(media)} alt='Media' className='mediasCard__photo' />
                    ) : (
                      <video src={URL.createObjectURL(media)} controls />
                    )}
                  </div>
                ))}
              </div>

              <button className='greenButton saveButton'>Enregistrer l'album</button>

            </form>

            : null}

      </div>
    </div>
  )
}

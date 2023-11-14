import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen.Component';
import { toastNotification, updateToastNotification } from '../../../Router';
import { useNavigate } from 'react-router-dom';
import Sweetpagination from 'sweetpagination';
import ModalPhoto from '../../../Components/Modal/ModalPhoto.Component';



export default function AlbumUpdate() {

  const [currentPageData, setCurrentPageData] = useState(new Array(2).fill());

  const { id } = useParams();
  const albumId = id
  const [album, setAlbum] = useState({})
  const [title, setTitle] = useState('');
  // eslint-disable-next-line
  const [currentTitle, setCurrentTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState([]);
  // eslint-disable-next-line
  const [showedImage, setShowedImage] = useState('');
  // eslint-disable-next-line
  const [currentThumbnail, setTCurrentThumbnail] = useState(null);
  const [medias, setMedias] = useState([]);
  const [newMedias, setNewMedias] = useState([]);
  const deletedMedias = []
  const [showModal, setShowModal] = useState(false);
  const [click, setClick] = useState(false);
  const [selectedCard, setSelectedCard] = useState({})


  useEffect(() => {
    const fetchData = async () => {
      const result = await useApi.albums.GetById({ id: id });
      const { data } = result;
      setTitle(data.album.title);
      setCurrentTitle(data.album.title);
      setShowedImage(data.album.thumbnail);
      setTCurrentThumbnail(data.album.thumbnail);
      setAlbum(data.album);
    }

    const fetchMedias = async () => {
      const response = await useApi.medias.GetByAlbumId({ albumId: albumId });
      // console.log(response)
      await setMedias(response.data)
    }
    fetchData();
    fetchMedias();
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

    if (newError.length > 0) {
      setError(newError);
      return;
    }

    const toastId = toastNotification('loading', 'Veuillez patienter...');
    const albumResponse = await useApi.albums.Update({ title: title, thumbnail: thumbnail === null || thumbnail === showedImage ? null : thumbnail, id: id })

    if (!albumResponse) {
      return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
    }

    if (albumResponse.error) {
      if (albumResponse.message) {
        updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + albumResponse.message + '.')
      } else {
        updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
      }
    } else {
      updateToastNotification(toastId, 'success', 'L\'album a bien été édité.')
      navigate('/espace-membre/medias/gestion', { replace: true });
    }

    const formData = new FormData();

    newMedias.forEach((newMedia, index) => {
      formData.append(`medias`, newMedia);
    });

    formData.append('albumId', albumId)

    if (newMedias.length === 0) {
      newError.push('medias');
    }

    if (newError.length > 0) {
      // console.log('Formulaire non envoyé')
      // console.log(newError)
      return setError(newError);
    } else {

      const newMediasResponse = await useApi.medias.Create(formData)

      if (!newMediasResponse) {
        return updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');
      }
      if (newMediasResponse.error) {
        if (newMediasResponse.message) {
          updateToastNotification(toastId, 'error', 'Une erreur est survenue : ' + newMediasResponse.message + '.')
        } else {
          updateToastNotification(toastId, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.')
        }
      } else {
        setNewMedias([])
        updateToastNotification(toastId, 'success', 'L\'album a bien été édité.')
        navigate('/espace-membre/medias/gestion', { replace: true });
      }
    };
  }

  const handleThumbnailChange = (e) => {
    const extension = e.target.files[0].type;

    if (!extension.split("/").includes('image')) {
      return toastNotification('error', 'Le format du fichier ');
    }

    setThumbnail(e.target.files[0]);
  }


  const handleClick = (id) => {
    // console.log(id)
    if (parseInt(selectedCard) !== parseInt(id)) {
      setSelectedCard(id);
    } else {
      setSelectedCard(null);
    }
    setClick(!click);
  };

  const handleDeleteMedia = async (id) => {
    const toastId = toastNotification('loading', 'Veuillez patienter...');

    deletedMedias.push(id)

    const response = await useApi.medias.Delete({ id: id });
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
      updateToastNotification(toastId, 'success', 'Le média a bien été supprimé.')
      setMedias(medias.filter(media => media.id !== id));
    }
  }

  const handleNewMedias = (event) => {
    const files = Array.from(event.target.files);
    // Si un des fichiers n'est pas une image, on ne l'ajoute pas au tableau
    const filesToAdd = files.filter(file => file.type.split("/").includes('image') || file.type.split("/").includes('video'))

    setNewMedias(filesToAdd)
  }




  const handleDeleteAlbum = async (id) => {
    const toastId = toastNotification('loading', 'Veuillez patienter...');

    const response = await useApi.albums.Delete({ id: id });
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
      updateToastNotification(toastId, 'success', 'L\'album a bien été supprimé.')
      navigate('/espace-membre/medias/gestion', { replace: true });
    }
  }



  return (
    <div className='usersPage'>
      <Helmet><title>La Concordia - Galerie médias</title></Helmet>

      <div id='category'>
        <h2>Modification de l'album <br /> "{album.title}"</h2>
      </div>

      <Link to='/espace-membre/medias/gestion' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>

      <div className='usersPage__content'>

        {album.length <= 0 || !album.title ? <LoadingScreen /> : <>
          <form onSubmit={(event) => event.preventDefault()}>
            <fieldset className='form'>

              <label
                htmlFor="title"
                className='usersPage__subheading'>
                Titre de l'album
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
                htmlFor="download"
                className='greenButton button importButton'>
                Modifier la photo de couverture
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
                onChange={handleThumbnailChange}
                multiple
              />
            </fieldset>
          </form>

          {thumbnail ? <img src={URL.createObjectURL(thumbnail)} alt="Médias de l'article" className='downloadImage' /> : showedImage ? <img src={`${useApi.baseUrl}/images/${showedImage}`} alt="Médias de l'article" className='downloadImage' /> : null}

          <div className='separator'></div>

          <h3 className='usersPage__subheading'>Contenu de l'album</h3>

          <div className='updateCardsContainer'>


            {medias.length === 0 ? <p className='empty'>L'album ne contient aucun médias</p> : null}


            {/* Utilisation d'une expression JSX qui vérifie si currentPageData existe et contient au moins un élément avec une propriété name. Si c'est le cas, la méthode map() est utilisée pour créer une nouvelle liste de Composants MediasCard. Si currentPageData est vide ou n'a pas de propriété name, rien n'est renvoyé. */}
            {currentPageData && currentPageData[0]?.file && currentPageData.length > 0 ? currentPageData.map((media, item) => (

              <div key={item} className='updateMediasCard'>

                <img src={`${useApi.baseUrl}/images/${media.file}`} alt='media' onClick={() => handleClick(media.id)} className='updateMediasCard__photo' />

                <div className={selectedCard === media.id ? "updateMediasActionsContainer active" : "updateMediasActionsContainer"} onClick={handleClick}>
                  <button onClick={() => handleDeleteMedia(media.id)} className='firstButton'>Supprimer</button>
                </div>

                <ModalPhoto showModal={showModal} setShowModal={setShowModal} >
                  <div className='modal photoModal'>
                    {/* Lors du clic sur le bouton, la valeur de "showModal" devient fausse afin de fermer la modale */}
                    <button className='closeButton'><i className="fa-solid fa-square-xmark"></i></button>
                    <img src={`${useApi.baseUrl}/images/${media.file}`} alt={media.file.split('/')[media.file.split('/').length - 1]} className='modal__medias' />
                    <p className='modal__mediasTitle'>{album.title}</p>
                  </div>
                </ModalPhoto>
              </div>
            )) : []}
          </div>



          <Sweetpagination
            currentPageData={setCurrentPageData}
            dataPerPage={2}
            getData={medias}
            navigation={true}
            getStyle={'pagination-style'}
          />

          <form onSubmit={(event) => handleSubmit(event)}>
            <fieldset className='form'>
              <label
                htmlFor="newMedias"
                className='greenButton button importButton'>
                Importer de nouveaux médias
              </label>

              <input
                type="file"
                // Le champs autorise uniquement les images et les vidéos
                accept="image/*,video/*"
                // Taille maximum de l'image : 1Go
                max-size="1000000000"
                name='newMedias'
                id='newMedias'
                multiple
                className='downloadInput'
                onChange={handleNewMedias}
              />

              <div className='updateCardsContainer'>


                {newMedias.map((newMedia, index) => (
                  <div key={index} className='importedMediaItem mediasCard'>
                    {newMedia.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(newMedia)} alt='Media' className='mediasCard__photo' />
                    ) : (
                      <video src={URL.createObjectURL(newMedia)} controls />
                    )}
                  </div>
                ))}
              </div>
              <button className='greenButton sendButton'>Mettre à jour</button>

            </fieldset>
          </form>
        </>}

        <button className='greenButton deletedButton' onClick={() => {
          if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
            handleDeleteAlbum(id);
          }
        }}>Supprimer l'album</button>
      </div>
    </div >
  )
}

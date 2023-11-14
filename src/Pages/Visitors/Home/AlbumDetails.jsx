import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Sweetpagination from 'sweetpagination';
import MediasCard from '../../../Components/Cards/MediasCard.Component';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';
// Page AlbumDetail, qui renvoi l'ensemble des médias de l'album sur lequel l'utilisateur à cliqué.
import { saveAs } from "file-saver";

export default function AlbumDetails(props) {

    const { isLogged } = props;

    // Utilisation du Hook useState pour définir les données de la page actuelle et leur états. "currentPageData" est initialisé avec un tableau de deux cases vides grâce à la méthode "fill()" d'un nouvel objet Array. Cette variable est utilisée par "SweetPagination" pour afficher les médias de la page courante.
    const [currentPageData, setCurrentPageData] = useState(new Array(2).fill());
    const [noData, setNoData] = useState(false);
    // Création des variables 
    const [album, setAlbum] = useState({})
    const [medias, setMedias] = useState([]);
    const [selectedMedias, setSelectedMedias] = useState({})

    // Récupération de l'id de l'album via les params
    const { id } = useParams();
    const albumId = id

    const navigate = useNavigate();


    // Récupération de l'album en fonction de son id récupéré dans les params
    const fetchAlbum = async () => {
        const response = await useApi.albums.GetById({ id: parseInt(id) });
        setAlbum(response.data.album);
        setMedias(response.data.medias);
        return true;
    }

    const fetchMedias = async () => {
        const response = await useApi.medias.GetByAlbumId({ albumId: albumId });
        // console.log(response)
        if (response.error) return navigate('/albums');

        if (response.data.length <= 0) {
            setNoData(true)
        } else {
            setNoData(false)
        }

        await setMedias(response.data)
    }

    const downloadAlbum = async () => {
        const images = medias.map(media => `${useApi.baseUrl}/images/${media.file}`)

        // Fetch all images from : useApi.baseUrl + /images/ + media.file
        const fetchedImages = await Promise.all(images.map(async (image) => {
            const response = await fetch(image);
            const blob = await response.blob();
            // Create a image file from the blob at correct format (not a zip)
            const imageFile = new File([blob], image.split('/').pop(), { type: blob.type });
            return imageFile;
        }));

        // Create a zip file from the images
        const zip = require('jszip')();
        for (let file = 0; file < fetchedImages.length; file++) {
            zip.file(fetchedImages[file].name, fetchedImages[file]);
        }
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, `${album.title}.zip`);
        });

    }

    useEffect(() => {
        fetchAlbum();
        fetchMedias();
        // eslint-disable-next-line
    }, []);





    return (
        <div className='pagePattern'>
            <Helmet><title>La Concordia - Galerie médias</title></Helmet>

            <div id='category'>
                <h2>Galerie médias</h2>
                <h3>{album.title}</h3>
            </div>

            <div className='pagePattern__cardsContent'>
                <div className='pagePattern__cardsContent__button'>
                    <div className='downloadAlbum'>

                        {isLogged ? <button onClick={downloadAlbum} className='greenButton'>Télécharger l'album</button> : null}


                    </div>
                    <Link to='/albums' className='returnButton'>
                        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
                    </Link>
                </div>


                {noData ? <p>Aucun média à afficher</p> : album.length <= 0 || medias.length <= 0 ? <MainLoadingScreen /> : <>

                    {medias.length <= 0 || !medias[0]?.file ?
                        <MainLoadingScreen /> :
                        <div>

                            <div className='cardsContainer'>
                                {/* Utilisation d'une expression JSX qui vérifie si currentPageData existe et contient au moins un élément avec une propriété name. Si c'est le cas, la méthode map() est utilisée pour créer une nouvelle liste de Composants MediasCard. Si currentPageData est vide ou n'a pas de propriété name, rien n'est renvoyé. */}
                                {currentPageData && currentPageData[0]?.file && currentPageData.length > 0 ? currentPageData.map((item, k) => (
                                    <MediasCard selectedCard={selectedMedias} setSelectedCard={setSelectedMedias} mediasCard={item} key={k} album={album.title} />
                                )) : null}
                            </div>

                            <div className='pagination'>

                                {/* Intégration du module SweetPagination, qui permet l'affichage de 6 cartes médias par page */}
                                <Sweetpagination
                                    currentPageData={setCurrentPageData}
                                    dataPerPage={6}
                                    getData={medias}
                                    navigation={true}
                                    getStyle={'pagination-style'}
                                />
                            </div >
                        </div>
                    }
                </>}
            </div>
        </div>
    )
}
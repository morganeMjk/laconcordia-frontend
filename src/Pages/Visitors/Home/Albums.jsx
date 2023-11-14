import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Sweetpagination from 'sweetpagination';
import AlbumCard from '../../../Components/Cards/AlbumCard.Component';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';

// Page Medias, qui retourne la liste des albums consultables par les visiteurs.

export default function Medias() {

    // Utilisation du Hook useState pour définir les données de la page actuelle et leur états. "currentPageData" est initialisé avec un tableau de deux cases vides grâce à la méthode "fill()" d'un nouvel objet Array. Cette variable est utilisée par "SweetPagination" pour afficher les albums de la page courante.
    const [currentPageData, setCurrentPageData] = useState(new Array(2).fill());
    const [noData, setNoData] = useState(false);
    const [allAlbums, setAllAlbums] = useState([])

    const fetchAllAlbums = async () => {
        const response = await useApi.albums.GetAll();

        if (response.data.length <= 0) {
            setNoData(true);
        }

        return setAllAlbums(response.data);
    }

    useEffect(() => {
        fetchAllAlbums()
    }, []);

    return (
        <div className='pagePattern'>
            {/* Utilisation de la bibliothèque Helmet pour modifier la balise html 'head' */}
            <Helmet><title>La Concordia - Galerie médias</title></Helmet>

            <div id='category'>
                <h2>Galerie médias</h2>
            </div>

            <div className='pagePattern__cardsContent'>

                {noData ? <p>Aucun album à afficher</p> : !allAlbums || allAlbums.length <= 0 ? <MainLoadingScreen /> :
                    <>
                        <div className='cardsContainer'>
                            {currentPageData && currentPageData[0]?.title && currentPageData.length > 0 ? currentPageData.map((item, k) => {
                                return <AlbumCard apiUrl={useApi.baseUrl} albumCard={item} key={k} />
                            }) : null}
                        </div>

                        <div className='pagination'>

                            <Sweetpagination
                                currentPageData={setCurrentPageData}
                                dataPerPage={6}
                                getData={allAlbums}
                                navigation={true}
                                getStyle={'pagination-style'}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
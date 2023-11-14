import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Sweetpagination from 'sweetpagination';
import NewsCard from '../../../Components/Cards/NewsCard.Component';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';

// Page News, qui retourne la liste des actualités consultables par les visiteurs.

export default function News() {

  // Utilisation du Hook useState pour définir les données de la page actuelle et leur état. "currentPageData" est initialisé avec un tableau de deux cases vides grâce à la méthode "fill()" d'un nouvel objet Array. Cette variable est utilisée par "SweetPagination" pour afficher les actualités de la page courante.
  const [currentPageData, setCurrentPageData] = useState({});
  const [noData, setNoData] = useState(false);
  const [allNews, setAllNews] = useState(null)

  const fetchAllNews = async () => {
    const response = await useApi.news.GetAll();
    const news = response.data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (news.length <= 0) {
      setNoData(true);
    }

    return setAllNews(news);
  }

  useEffect(() => {
    fetchAllNews();
    // console.log(currentPageData)
  }, []);
  // console.log(currentPageData)

  return (
    <div className='pagePattern'>
      {/* Utilisation de la bibliothèque Helmet pour modifier la balise html "head" */}
      <Helmet><title>La Concordia - Actualités</title></Helmet>
      <div id='category'>
        <h2>
          Actualités
        </h2>
      </div>

      <div>
        {noData ? <p>Aucune actualité à afficher</p> : !allNews || allNews.length <= 0 ? <MainLoadingScreen /> :
          <>

            <div className="cardsContainer">
              {/* Utilisation d'une expression JSX qui vérifie si "currentPageData" existe et contient au moins un élément avec une propriété "thumbnail". Si c'est le cas, la méthode map() est utilisée pour créer une nouvelle liste de Composants "NewsCard". Si "currentPageData" est vide ou n'a pas de propriété "thumbnail", rien n'est renvoyé. */}
              {currentPageData && currentPageData[0]?.thumbnail && currentPageData.length > 0 ? currentPageData.map((item, k) => (
                <NewsCard apiUrl={useApi.baseUrl} newsCard={item} key={k} />
              )) : <p>Aucune actualité à afficher</p>}
            </div>

            <div className='pagination'>
              {/* Intégration du module "SweetPagination", qui permet l'affichage de 6 cartes actualités par page */}
              <Sweetpagination
                currentPageData={setCurrentPageData}
                dataPerPage={6}
                getData={allNews || []}
                navigation={true}
                getStyle={'pagination-style'}
              />
            </div>
          </>}
      </div>
    </div>
  )
}

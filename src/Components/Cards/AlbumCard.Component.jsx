import React from 'react';
import { Link } from 'react-router-dom';

// Composant AlbumCard qui est utilisé sur les pages Visitors/Albums et Users/AlbumsList.

export default function AlbumCard(props) {

    // Intégration des données name, thumbnail et id en tant que props
    const { title, thumbnail, id } = props.albumCard;
    const { apiUrl } = props;

    const description = `${title.substring(0, 10)} [...]`

    // Création de la variable "isUsersPage" qui vérifie si l'url actuel débute par "espace-membre". Le but étant que si l'url ne débute pas par "espace-membre", un lien redirige le visiteur pour consulter les médias de l'album.
    const isUsersPage = window.location.pathname.startsWith('/espace-membre');

    // Si l'url débute bien par "espace-membre", on affiche uniquement la div "albumCard", dans laquelle se trouve la photo de couverture, ainsi que le titre de l'album
    if (isUsersPage) {
        return (
            <div key={id} className='albumCard'>
                <Link to={`/espace-membre/medias/gestion/${id}`} className='link'>
                    <img src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='albumCard__img' />

                    <div>
                        {title.length < 10 ? <h3 className='albumCard__title'>{title}</h3>
                            : <h3 className='albumCard__title'>{description}</h3>
                        }
                    </div>

                </Link>
            </div>
        )
    }

    // Si l'url ne débute pas par "espace-membre" les éléments présents dans la div "albumCard" sont englobés d'un lien qui mène vers l'album concerné
    else {
        return (
            <div key={id} className='albumCard'>
                <Link to={`/albums/${id}`} className='link'>
                    <img src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='albumCard__img' />

                    <div>
                        {title.length < 10 ? <h3 className='albumCard__title'>{title}</h3>
                            : <h3 className='albumCard__title'>{description}</h3>
                        }
                    </div>

                </Link>
            </div>
        )
    }
}
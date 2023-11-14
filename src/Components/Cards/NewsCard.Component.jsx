import React from 'react';
import { Link } from 'react-router-dom';


// Composant NewsCard qui est utilisé sur les pages Visitors/News et Users/NewsList.

export default function NewsCard(props) {

    // Intégration des données "thumbnail", "title", "content", "createdAt" et "id" en tant que props.
    const { thumbnail, title, description, createdAt, id } = props.newsCard;
    const { apiUrl } = props;

    // Création de la variable "isUsersPage" qui vérifie si l'url actuel débute par "espace-membre". Le but étant que si l'url ne débute pas par "espace-membre", un lien redirige le visiteur pour consulter l'article complet.
    const isUsersPage = window.location.pathname.startsWith('/espace-membre');

    const formattedDate = `${new Date(createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })} - ${new Date(createdAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;

    // Si l'url débute bien par "espace-membre", on affiche uniquement la div "cards", dans laquelle se trouve la photo de couverture, les premiers caractères de l'article, la date de création et le lien vers la localisation de l'évènement
    if (isUsersPage) {
        return (
            <div key={id} className='cards usersCards'>
                <Link to={`/espace-membre/actualites/gestion/${id}`} className='link'>
                    <img src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='cards__img' />
                    <div className='cards__content'>
                        <h3 className='cards__content__title'>{title}</h3>

                        {/* Le taille du contenu de l'article est divisée afin de ne laisser apparaitre que les premiers caractères de l'article */}
                        <p className='cards__content__summary'>{description}</p>
                        <p className='cards__content__date'>{formattedDate}</p>
                    </div>
                </Link>
            </div>
        )
    }

    // Si l'url ne débute pas par "espace-membre" les éléments présents dans la div "cards" sont englobés d'un lien qui mène vers l'article concerné.
    else {
        return (
            <div key={id} className='cards'>
                <Link to={`/actualites/${id}`} className='link'>
                    <img src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='cards__img' />
                    <div className='cards__content'>
                        <h3 className='cards__content__title'>{title}</h3>
                        <p className='cards__content__summary'>{description}</p>
                        <p className='cards__content__date'>{formattedDate}</p>
                    </div>
                </Link>
            </div>
        )
    }
}
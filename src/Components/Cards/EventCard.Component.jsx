import React from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';


// Composant EventCard qui est utilisé sur les pages Visitors/Events et Users/EventsList.

export default function EventCard(props) {

    // Intégration des données "thumbnail", "title", "content", "createdAt" et "id" en tant que props.
    const { thumbnail, title, content, eventDate, id } = props.eventCard;
    const { apiUrl } = props;

    const description = `${content.substring(0, 20)} [...]`

    // console.log(title)

    // Création de la variable "isUsersPage" qui vérifie si l'url actuel débute par "espace-membre". Le but étant que si l'url ne débute pas par "espace-membre", un lien redirige le visiteur pour consulter l'article complet.
    const isUsersPage = window.location.pathname.startsWith('/espace-membre');

    const formattedDate = `${new Date(eventDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })} - ${new Date(eventDate).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;


    // Si l'url débute bien par "espace-membre", on affiche uniquement la div "cards", dans laquelle se trouve la photo de couverture, les premiers caractères de l'article, la date de création et le lien vers la localisation de l'évènement
    if (isUsersPage) {
        return (
            <div key={id} className='cards usersCards'>
                <Link to={`/espace-membre/evenements/gestion/${id}`} className='link'>
                    <img src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='cards__img' />
                    <div className='cards__content' >
                        <h3 className='cards__content__title'>{title}</h3>

                        {/* Le taille du contenu de l'article est divisée afin de ne laisser apparaitre que les premiers caractères de l'article */}
                        <p className='cards__content__content'></p>

                        {parse(description, {})}

                        <div className='cards__content__footer'>
                            <p className='cards__content__footer__date'>{formattedDate}</p>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    // Si l'url ne débute pas par "espace-membre" les éléments présents dans la div "cards" sont englobés d'un lien qui mène vers l'article concerné.
    else {
        return (
            <div key={id} className='cards'>
                <Link to={`/evenements/${id}`} className='link'>
                    <img width={'100%'} src={`${apiUrl}/images/${thumbnail}`} alt="Couverture" className='cards__img' />
                    <div className='cards__content'>
                        <h3 className='cards__content__title'>{title}</h3>

                        {parse(description, {})}
                        
                        <p className='cards__content__date'>{formattedDate}</p>
                    </div>
                </Link>
            </div>
        )
    }
}
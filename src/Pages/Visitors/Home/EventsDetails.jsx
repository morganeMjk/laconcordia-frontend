import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import parse from 'html-react-parser';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';

// Page EventsDetail qui retourne le détail de l'évènement sur lequel le visiteur a cliqué.

export default function EventsDetails() {

  const [event, setEvent] = useState({})
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    const response = await useApi.events.GetById({ id: parseInt(id) });
    if (response.error) return navigate('/evenements');

    return setEvent(response.data);
  }
  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  if (event.length <= 0 || !event.thumbnail) return <MainLoadingScreen />

  const formattedDate = `${new Date(event.eventDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })} - ${new Date(event.eventDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;

  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - Évènements</title></Helmet>
      <div id='category'>
        <h2>{event.title}</h2>
        <h3>{formattedDate}</h3>
      </div>
      <Link to='/evenements' className='returnButton'>
        <i className="fa-solid fa-circle-up fa-rotate-270"></i>
      </Link>
      <div className='pagePattern__content'>
        <>
          {typeof event.content === 'string' ? parse(event.content, {}) : null}
        </>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavbarUsers(props) {

  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
    setSheetClick(false)
    setEventClick(false)
    setMediasClick(false)
    setNewsClick(false)
  }

  const [sheetClick, setSheetClick] = useState(false);
  const sheetHandleClick = () => {
    setSheetClick(!sheetClick);
    setEventClick(false)
    setMediasClick(false)
    setNewsClick(false)
  }

  const [eventClick, setEventClick] = useState(false);
  const eventHandleClick = () => {
    setEventClick(!eventClick);
    setSheetClick(false)
    setMediasClick(false)
    setNewsClick(false)
  }

  const [mediasClick, setMediasClick] = useState(false);
  const mediasHandleClick = () => {
    setMediasClick(!mediasClick);
    setSheetClick(false)
    setEventClick(false)
    setNewsClick(false)
  }

  const [newsClick, setNewsClick] = useState(false);
  const newsHandleClick = () => {
    setNewsClick(!newsClick);
    setSheetClick(false)
    setEventClick(false)
    setMediasClick(false)
  }


  const { user, logout } = props;

  const disconnectedClick = () => {
    logout("logout");
  }

  const checkRole = (selectedRoles) => {
    const currentRoles = user?.userRoles?.map(role => role.name);

    return selectedRoles.some((role) => currentRoles?.includes(role));
  }

  return (
    <nav className='usersNavbar'>

      <div className='usersNavbar__header'>
        <div className='usersNavbar__header__logoContainer'>
          <Link to='/' className='link'>
            <img src={require('./../../assets/logo.png')} className='usersNavbar__header__logoContainer__logo' alt='logo' />
            <h1 className='usersNavbar__header__logoContainer__title'>La Concordia</h1>
          </Link>
        </div>

        <div className='usersNavbar__header__openIcon' onClick={handleClick}>
          <i className={click ? "fas fa-xmark" : "fas fa-bars"}></i>
        </div>
      </div>

      <ul className={click ? "usersNavbar__list active" : "usersNavbar__list"}>

        <li>
          <div className='usersNavbar__list__subheading'>
            <NavLink to={'/espace-membre'} activeclassname="active" className="usersNavbar__list__link link" onClick={handleClick}>
              Profil
            </NavLink>
          </div>
        </li>

        {checkRole(["administrator", "musician", "professor", "archivist", "chief"]) &&
          <li>
            <div className='usersNavbar__list__subheading' onClick={sheetHandleClick}>
              <p>Partitions</p>
            </div>

            <ul className={sheetClick ? "usersNavbar__list__sublist active" : "usersNavbar__list__sublist"}>
              <li>
                <NavLink to={'/espace-membre/partitions/mes-partitions'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { sheetHandleClick(); handleClick(); }}>
                  Mes partitions
                </NavLink>
              </li>

              {checkRole(["administrator", "archivist", "chief"]) &&
                <>
                  <li>
                    <NavLink to={'/espace-membre/partitions/gestion'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { sheetHandleClick(); handleClick(); }}>
                      Gérer les partitions
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to={'/espace-membre/partitions/creation'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { sheetHandleClick(); handleClick(); }}>
                      Créer une partition
                    </NavLink>
                  </li>
                </>
              }
            </ul>
          </li>
        }

        {checkRole(["administrator", "redactor", "professor", "photographer"]) &&
          <li>
            <div className='usersNavbar__list__subheading' onClick={eventHandleClick}>
              <p>Évènements</p>
            </div>

            <ul className={eventClick ? "usersNavbar__list__sublist active" : "usersNavbar__list__sublist"}>
              <li>
                <NavLink to={'/espace-membre/evenements/gestion'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { eventHandleClick(); handleClick(); }}>
                  Gérer les évènements
                </NavLink>
              </li>

              <li>
                <NavLink to={'/espace-membre/evenements/creation'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { eventHandleClick(); handleClick(); }}>
                  Créer un évènement
                </NavLink>
              </li>
            </ul>
          </li>
        }

        {checkRole(["administrator", "photographer"]) &&

          <li>
            <div className='usersNavbar__list__subheading' onClick={mediasHandleClick}>
              <p>Médias</p>
            </div>

            <ul className={mediasClick ? "usersNavbar__list__sublist active" : "usersNavbar__list__sublist"}>
              <li>
                <NavLink to={'/espace-membre/medias/gestion'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { mediasHandleClick(); handleClick(); }}>
                  Gérer les médias
                </NavLink>
              </li>

              <li>
                <NavLink to={'/espace-membre/medias/creation'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { mediasHandleClick(); handleClick(); }}>
                  Créer un album
                </NavLink>
              </li>
            </ul>
          </li>
        }

        {checkRole(["administrator", "redactor", "professor", "photographer"]) &&

          <li>
            <div className='usersNavbar__list__subheading' onClick={newsHandleClick}>
              <p>Actualités</p>
            </div>

            <ul className={newsClick ? "usersNavbar__list__sublist active" : "usersNavbar__list__sublist"}>
              <li>
                <NavLink to={'/espace-membre/actualites/gestion'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { newsHandleClick(); handleClick(); }}>
                  Gérer les actualités
                </NavLink>
              </li>

              <li>
                <NavLink to={'/espace-membre/actualites/creation'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { newsHandleClick(); handleClick(); }}>
                  Créer une actualité
                </NavLink>
              </li>
            </ul>
          </li>
        }

        {checkRole(["administrator"]) &&

          <li>
            <div className='usersNavbar__list__subheading'>
              <NavLink to={'/espace-membre/utilisateurs'} activeclassname="active" className="usersNavbar__list__link link" onClick={handleClick}>
                Gérer les utilisateurs
              </NavLink>
            </div>
          </li>
        }

        <li>
          <div className='disconnected'>
            <NavLink to={'/'} activeclassname="active" className="usersNavbar__list__link link" onClick={() => { handleClick(); disconnectedClick(); }}>
              Déconnexion
            </NavLink>
          </div>
        </li>

      </ul>


    </nav >
  )
}
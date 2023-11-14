import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar(props) {
  const { isLogged } = props;
  
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
    setInfoClick(false)
  }
  
  const [infoClick, setInfoClick] = useState(false);
  const infoHandleClick = () => setInfoClick(!infoClick);
  

  return (
    <nav className={click ? "navbar active" : "navbar"}>
      <div className='navbar__header'>

        <div className='navbar__header__logoContainer'>
          <img src={require('./../../assets/logo.png')} className='navbar__header__logoContainer__logo' alt='logo' />
          <h1 className='navbar__header__logoContainer__title'>La Concordia</h1>
        </div>

        <div className='navbar__header__openIcon' onClick={handleClick} >
          <i className={click ? "fas fa-xmark" : "fas fa-bars"}></i>
        </div>
      </div>

      <ul className={click ? "navbar__list active" : "navbar__list"}>

        <li className='navbar__list__title'>
          <NavLink to={'/'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>Accueil</NavLink>
        </li>


        <li className='navbar__list__title'>
          <div className='navbar__list__title__dropdown'>
            <div className='navbar__list__title__info' onClick={infoHandleClick}>
              <p>Informations</p>
            </div>

            <ul className={infoClick ? "navbar__list__title__sublist active" : "navbar__list__title__sublist"}>

              <li className='navbar__list__title__sublist__subheading'>
                <NavLink to={'/informations/harmonie-clique'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>
                  Harmonie & Clique
                </NavLink>
              </li>
              <li className='navbar__list__title__sublist__subheading'>
                <NavLink to={'/informations/ecole-de-musique'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>
                  École de musique
                </NavLink>
              </li>
              <li className='navbar__list__title__sublist__subheading'>
                <NavLink to={'/informations/commission'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>
                  Commission
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li className='navbar__list__title'>
          <NavLink to={'/contact'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>Contact</NavLink>
        </li>

        <li className='navbar__list__title'>
          <NavLink to={isLogged ? 'espace-membre' : '/connexion'} className='navbar__list__title__link link' activeclassname="active" onClick={handleClick}>Espace Membre</NavLink>
        </li>
      </ul>
    </nav>
  )
}
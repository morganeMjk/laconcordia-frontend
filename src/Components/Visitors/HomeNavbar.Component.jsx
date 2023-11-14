import React from 'react';
import { NavLink } from 'react-router-dom';

export default function HomeNavbar() {

  return (
    <ul className='homeNavbar'>
      <li className='homeNavbar__item'>
        <NavLink to={'/actualites'} className='homeNavbar__link link' activeclassname='homeNavbar__link--active'>
          Actualités
        </NavLink>
      </li>

      <li className='homeNavbar__item'>
        <NavLink to={'/evenements'} className='homeNavbar__link link' activeclassname='homeNavbar__link--active'>
          Évènements
        </NavLink>
      </li>

      <li className='homeNavbar__item'>
        <NavLink to={'/albums'} className='homeNavbar__link link' activeclassname='homeNavbar__link--active'>
          Médias
        </NavLink>
      </li>

      <li className='homeNavbar__item'>
        <NavLink to={'/apropos'} className='homeNavbar__link link' activeclassname='homeNavbar__link--active'>
          À propos
        </NavLink>
      </li>
    </ul>
  )
}

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';

// Page Band, qui permet l'affichage des membres de l'harmonie et de la clique.

export default function Band() {

  const [allStatus, setAllStatus] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allUserStatus, setAllUserStatus] = useState([])
  const [allInstruments, setAllInstruments] = useState([])
  const [allUserInstruments, setAllUserInstruments] = useState([])



  const fetchAllUsers = async () => {
    const response = await useApi.user.GetBase();
    return setAllUsers(response.data);
  }

  const fetchAllStatus = async () => {
    const response = await useApi.status.GetAll();
    return setAllStatus(response.data);
  }

  const fetchAllUserStatus = async () => {
    const response = await useApi.userStatus.GetAll();
    return setAllUserStatus(response.data);
  }

  const fetchAllInstruments = async () => {
    const response = await useApi.instruments.GetAll();
    return setAllInstruments(response.data);
  }

  const fetchAllUserInstruments = async () => {
    const response = await useApi.userInstruments.GetAll();
    return setAllUserInstruments(response.data);
  }



  useEffect(() => {
    fetchAllUsers();
    fetchAllStatus();
    fetchAllUserStatus();
    fetchAllInstruments();
    fetchAllUserInstruments();
  }, []);


  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - Harmonie & Clique</title></Helmet>

      <div id='category'>
        <h2>Harmonie & Clique</h2>
        <h3>Effectif actuel</h3>
      </div>

      <div className='bandPage pagePattern__content'>
        {!allStatus || allStatus.length <= 0 || !allUsers || allUsers.length <= 0 || !allUserStatus || allUserStatus.length <= 0 ? <MainLoadingScreen /> : <>
          <div className='harmonie'>
            {allStatus.map((status, key) => {
              if (status.type === 'DirectionHarmonie') {
                return (
                  <div key={key}>
                    <h3 className='pagePattern__subheading'>{status.label}</h3>
                    <div className='separator'></div>
                    {allUserStatus.map((userstatus, index) => {
                      if (userstatus.statusId === status.id) {
                        return (
                          <div key={index}>
                            {allUsers.map((user, id) => {
                              if (userstatus.userId === user.id) {
                                return (
                                  <div key={id} className='bandMembers'>
                                    <p>{user.firstName} {user.lastName}</p>
                                  </div>
                                )
                              }
                              return null;
                            })}
                          </div>
                        )
                      }
                      return null;
                    })}
                  </div>
                )
              }
              return null;
            })}


            {allStatus.map((status, key) => {
              if (status.type === 'MusicienHarmonie') {
                return (
                  <div key={key}>
                    {allInstruments.map((instrument, index) => {
                      if (instrument.statusId === status.id) {
                        return (
                          <div key={index} >
                            <h3 className='pagePattern__subheading'>{instrument.label}</h3>
                            <div className='separator'></div>
                            {allUserInstruments.map((userinstrument, id) => {
                              if (instrument.id === userinstrument.instrumentId) {
                                return (
                                  <div key={id}>
                                    {allUsers.map((user, userId) => {
                                      if (user.id === userinstrument.userId) {
                                        return (
                                          <div key={userId} className='bandMembers'>
                                            <p>{user.firstName} {user.lastName}</p>
                                          </div>
                                        )
                                      }
                                      return null
                                    })}
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              }
              return null;
            })}
          </div>


          <div className='clique'>
            {allStatus.map((status, key) => {
              if (status.type === 'DirectionClique') {
                return (
                  <div key={key} className='clique__content'>
                    <h3 className='pagePattern__subheading'>{status.label}</h3>
                    <div className='separator'></div>
                    {allUserStatus.map((userstatus, index) => {
                      if (userstatus.statusId === status.id) {
                        return (
                          <div key={index}>
                            {allUsers.map((user, id) => {
                              if (userstatus.userId === user.id) {
                                return (
                                  <div key={id} className='bandMembers'>
                                    <p>{user.firstName} {user.lastName}</p>
                                  </div>
                                )
                              }
                              return null;
                            })}
                          </div>
                        )
                      }
                      return null;
                    })}
                  </div>
                )
              }
              return null;
            })}


            {allStatus.map((status, key) => {
              if (status.type === 'MusicienClique') {
                return (
                  <div key={key}>
                    {allInstruments.map((instrument, index) => {
                      if (instrument.statusId === status.id) {
                        return (
                          <div key={index} className='clique__content'>
                            <h3 className='pagePattern__subheading'>{instrument.label}</h3>
                            <div className='separator'></div>
                            {allUserInstruments.map((userinstrument, id) => {
                              if (instrument.id === userinstrument.instrumentId) {
                                return (
                                  <div key={id}>
                                    {allUsers.map((user, userId) => {
                                      if (user.id === userinstrument.userId) {
                                        return (
                                          <div key={userId} className='bandMembers'>
                                            <p>{user.firstName} {user.lastName}</p>
                                          </div>
                                        )
                                      }
                                      return null
                                    })}
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              }
              return null;
            })}
          </div>
        </>
        }
      </div>
    </div>
  )
}
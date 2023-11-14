import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';

// Page Committee, qui permet l'affichage des membres de la commission.

export default function Committee() {

  const [allStatus, setAllStatus] = useState([])
  const [allUserStatus, setAllUserStatus] = useState([])
  const [allUsers, setAllUsers] = useState([])

  const fetchAllUsers = async () => {
    const response = await useApi.user.GetBase();
    // console.log("users", response.data)
    return setAllUsers(response.data);
  }

  const fetchAllStatus = async () => {
    const response = await useApi.status.GetAll();
    // console.log("status", response.data)
    return setAllStatus(response.data);
  }

  const fetchAllUserStatus = async () => {
    const response = await useApi.userStatus.GetAll();
    // console.log("userstatus", response.data)
    return setAllUserStatus(response.data);
  }

  useEffect(() => {
    fetchAllUsers();
    fetchAllStatus();
    fetchAllUserStatus()
  }, []);




  return (
    <div className='pagePattern'>
      <Helmet><title>La Concordia - Commission</title></Helmet>

      <div id='category'>
        <h2>Commission</h2>
        <h3>Effectif actuel</h3>
      </div>

      <div className='committee pagePattern__content'>
        {!allStatus || allStatus.length <= 0 || !allUsers || allUsers.length <= 0 || !allUserStatus || allUserStatus.length <= 0 ? <MainLoadingScreen /> : <>
          {/* Les données "StatusDatas" sont mappées afin d'afficher les labels des status dont le type est "Committee". Pour chacun de ces labels, les membres ayant ce status sont affichés grace à l'utilisation de la fonction ".map" sur les données "UsersDatas". */}
          {allStatus.map((status, key) => {
            // console.log("status", status)
            if (status.type === 'committee') {
              // console.log("status", status)
              return (
                <div key={key}>
                  <h3 className='pagePattern__subheading'>{status.label}</h3>
                  <div className='separator'></div>

                  {allUserStatus.map((userstatus, index) => {
                    if (userstatus.statusId === status.id) {
                      // console.log("userstatus", userstatus)
                      return (
                        <div key={index} className='committeeContainer'>
                          {allUsers.map((user, id) => {
                            if (userstatus.userId === user.id) {
                              return (
                                <div key={id}>
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
        </>}
      </div>
    </div>
  )
}
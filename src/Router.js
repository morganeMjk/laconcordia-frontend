import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import HeaderVisitors from './Components/Visitors/HeaderVisitors.Component';
import UsersPage from './Components/Users/UsersPage';
import { About, Events, EventsDetails, Albums, AlbumDetails, News, NewsDetails, TermsOfUse } from './Pages/Visitors/Home/exports';
import { Band, Committee, MusicSchool } from './Pages/Visitors/Informations/exports';
import Contact from './Pages/Visitors/Contact/Contact';
import { SignUp, SignIn, EmailVerification, ResetPassword } from './Pages/Visitors/MemberSpace/exports';
import { EventsCreate, EventsList, EventsUpdate, AlbumsCreate, AlbumsList, AlbumUpdate, Messages, NewsCreate, NewsList, NewsUpdate, Profil, SheetsCreate, SheetsList, SheetsUpdate, SheetsUsers, UsersUpdate, UserUpdate } from './Pages/Users/exports';
import Footer from './Components/Footer/Footer.Component';
import ApiHandler from './service/ApiHandler';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen.Component';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';


const TRACKING_ID = "G-5CZN01LR04";
ReactGA.initialize(TRACKING_ID);

export const useApi = new ApiHandler(localStorage.getItem('accessToken') || null);

export function Router() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <RouterContainer />
    </BrowserRouter>
  );
}





export const toastNotification = (type, message) => {
  return toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export const updateToastNotification = (id, type, message) => {
  return toast.update(id, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
  })
}

function RouterContainer() {
  const [user, setUser] = useState({});
  const [notification, setNotification] = useState(false);
  const [isLogged, setIsLogged] = useState(Boolean(localStorage.getItem('accessToken')) || false);




  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);



  const logout = (reason) => {
    if (reason === "logout") {
      toastNotification('info', 'Vous êtes désormais déconnecté.')
    } else {
      toastNotification('error', 'Votre session a expirée, veuillez vous reconnecter.')
    }
    setUser({})
    setIsLogged(false)
    return localStorage.removeItem('accessToken')
  }

  const fetchProfile = async () => {
    const response = await useApi.user.GetProfile()
    if (response && !response.error) {
      if (response.data.deletionDate) return logout();
      setUser(response.data)
      setIsLogged(true)
      setNotification(response.data.notification);
      return true
    } else if (response && response.error) {
      logout()
      return false
    }
  }

  useEffect(() => {
    if (isLogged) {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [])




  // Création des states relatifs aux messages / messages lus / message selectionné

  const [selectedMessage, setSelectedMessage] = useState({});
  const [readMessages, setReadMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([])
  const [messageIsRead, setMessageIsRead] = useState(selectedMessage.isRead);

  const fetchAllMessages = async () => {
    const response = await useApi.message.GetAll();
    // console.log("fetchAllMessages", response.data)
    console.log("userRoles", user.userRoles)
    console.log("checkRole", checkRole(['administrator', 'committee']));
    if (checkRole(['administrator', 'committee'])) {
      return setAllMessages(response.data);
    } else {
      return setAllMessages([]);
    }
  }


  const location = useLocation();
  
  const [isPanelRoute, setIsPanelRoute] = useState(false);

  useEffect(() => {
    setIsPanelRoute(location.pathname.startsWith('/espace-membre'));
  }, [location.pathname]);

  useEffect(() => {
    if (isLogged && user?.userRoles) {
      fetchAllMessages()
    }
    // eslint-disable-next-line
  }, [isLogged, user?.userRoles]);



  const checkRole = (selectedRoles) => {
    const currentRoles = user?.userRoles?.map(role => role.name);

    return selectedRoles.some((role) => currentRoles?.includes(role));
  }

  if (isLogged && (!user || !user.userRoles)) {
    return <LoadingScreen />
  } else {
    // fetchAllMessages()
  };

  return (
    <>
      {isPanelRoute ? <UsersPage logout={logout} isLogged={isLogged} setIsLogged={setIsLogged} user={user} allMessages={allMessages} /> : <HeaderVisitors user={user} isLogged={isLogged} />}
      <Routes>
        <Route path='/'>
          <Route index element={<News />} />

          <Route path='actualites'>
            <Route index element={<News />} />
            <Route path=':id' element={<NewsDetails />} />
          </Route>

          <Route path='evenements'>
            <Route index element={<Events />} />
            <Route path=':id' element={<EventsDetails />} />
          </Route>

          <Route path='albums'>
            <Route index element={<Albums />} />
            <Route path=':id' element={<AlbumDetails isLogged={isLogged} />} />
          </Route>

          <Route path='apropos'>
            <Route index element={<About />} />
          </Route>

          <Route path='cgu'>
            <Route index element={<TermsOfUse />} />
          </Route>

          <Route path='informations'>
            <Route path='harmonie-clique' element={<Band />} />
            <Route path='ecole-de-musique' element={<MusicSchool />} />
            <Route path='commission' element={<Committee />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Route>

          <Route path='contact'>
            <Route index element={<Contact />} />
          </Route>

          {!isLogged || user?.length <= 0 ?
            <>
              <Route path='inscription'>
                <Route index element={<SignUp />} />
              </Route>

              <Route path='connexion'>
                <Route index element={<SignIn fetchProfile={fetchProfile} />} />
              </Route>

              <Route path='verification'>
                <Route index element={<EmailVerification />} />
              </Route>

              <Route path='reinitialisation-mdp'>
                <Route index element={<ResetPassword />} />
              </Route>

              <Route path='*' element={<Navigate to='/' replace />} />
            </>
            :
            <Route path='espace-membre'>

              <Route index element={<Profil user={user} notification={notification} setNotification={setNotification} />} />


              {
                checkRole(['administrator', 'committee']) ?
                  <Route path='messages'>
                    <Route index element={
                      <Messages
                        selectedMessage={selectedMessage}
                        setSelectedMessage={setSelectedMessage}
                        readMessages={readMessages}
                        setReadMessages={setReadMessages}
                        allMessages={allMessages}
                        setAllMessages={setAllMessages}
                        messageIsRead={messageIsRead}
                        setMessageIsRead={setMessageIsRead}
                        fetchAllMessages={fetchAllMessages}
                      />}
                    />
                    <Route path='*' element={<Navigate to='/espace-membre' replace />} />
                  </Route>
                  :
                  null
              }

              {checkRole(["administrator", "musician", "professor", "archivist", "chief"]) &&
                <Route path='partitions'>
                  {checkRole(["administrator", "archivist", "chief"]) &&
                    <Route path='gestion'>
                      <Route index element={<SheetsList />} />
                      <Route path=':id' element={<SheetsUpdate />} />
                    </Route>
                  }
                  <Route path='mes-partitions' element={<SheetsUsers user={user} />} />
                  <Route path='creation' element={<SheetsCreate />} />
                  <Route path='*' element={<Navigate to='/espace-membre' replace />} />
                </Route>
              }
              {checkRole(["administrator", "redactor", "professor", "photographer"]) &&
                <Route path='evenements'>
                  <Route path='gestion'>
                    <Route index element={<EventsList />} />
                    <Route path=':id' element={<EventsUpdate />} />
                  </Route>
                  <Route path='creation' element={<EventsCreate />} />
                  <Route path='*' element={<Navigate to='/espace-membre' replace />} />
                </Route>
              }

              {checkRole(["administrator", "photographer"]) &&

                <Route path='medias'>
                  <Route path='gestion'>
                    <Route index element={<AlbumsList />} />
                    <Route path=':id' element={<AlbumUpdate />} />
                  </Route>
                  <Route path='creation' element={<AlbumsCreate />} />
                  <Route path='*' element={<Navigate to='/espace-membre' replace />} />
                </Route>
              }

              {checkRole(["administrator", "redactor", "professor", "photographer"]) &&

                <Route path='actualites'>
                  <Route path='gestion'>
                    <Route index element={<NewsList />} />
                    <Route path=':id' element={<NewsUpdate />} />
                  </Route>
                  <Route path='creation' element={<NewsCreate />} />
                  <Route path='*' element={<Navigate to='/espace-membre' replace />} />
                </Route>
              }


              {checkRole(["administrator"]) &&
                <Route path='utilisateurs'>
                  <Route index element={<UsersUpdate />} />
                  <Route path=':id' element={<UserUpdate />} />
                </Route>
              }

              <Route path='*' element={<Navigate to='/espace-membre' replace />} />
            </Route>
          }

        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>)
}
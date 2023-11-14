import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Modal from '../../Components/Modal/Modal.Component';
import { useApi } from '../../Router';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen.Component';

export default function Messages(props) {

  const { selectedMessage, setSelectedMessage, readMessages, setReadMessages, allMessages,  messageIsRead, setMessageIsRead, fetchAllMessages } = props

  const [showModal, setShowModal] = useState(false);

  const handleModal = (data) => {
    setSelectedMessage(data);
    setShowModal(true)
    setReadMessages([...readMessages, data.id]);
  }
  const handleDelete = async (id, state) => {
    const response = await useApi.message.ArchiveMessage({ id: id, state: state });
    if (!response.error) {
      // console.log(response)
      setSelectedMessage({});
      await fetchAllMessages();
    } else {
      // console.log(response);
    }
  }

  const compareMessagesByDate = (a, b) => {
    if (a.createdAt > b.createdAt) {
      return -1; // a avant b
    } else if (a.createdAt < b.createdAt) {
      return 1; // b avant a
    } else {
      return 0; // aucun changement
    }
  }

  const [showArchivedMessages, setShowArchivedMessages] = useState(false);

  const handleArchiveMessage = () => {
    setShowArchivedMessages(!showArchivedMessages);
  }

  const handleReadMessage = async (message, state) => {
    const { id } = message;
    const response = await useApi.message.IsReadMessage({ id: id, state: state });
    if (!response.error) {
      // console.log(response);
      const updatedSelectedMessage = { ...selectedMessage, isRead: !selectedMessage.isRead };
      setSelectedMessage(updatedSelectedMessage)
      setMessageIsRead(!messageIsRead);
      fetchAllMessages();
    } else {
      if (response.error) {
        const updatedSelectedMessage = { ...selectedMessage, isRead: !selectedMessage.isRead };
        setSelectedMessage(updatedSelectedMessage)
      }
      // console.log(response);
    }
  };

  return (
    <div className='tablePage'>

      <Helmet><title>La Concordia - Messages</title></Helmet>

      <div id='category'>
        <h2>Mes messages</h2>
      </div>

      <div className='tablePage__content'>

        {!allMessages || allMessages.length <= 0 ? <LoadingScreen /> : <>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sujet</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>
              {allMessages.sort(compareMessagesByDate).map((message) => {
                const formattedDate = `${new Date(message.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - ${new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}`;

                if (!message.deletionDate) {
                  return (
                    <tr key={message.id}>
                      <td>{formattedDate}</td>
                      <td>{message.subject}</td>
                      <td className='buttonCell'>
                        {message.isRead ?
                          <button className='tableButton button--static' onClick={() => handleModal(message)}><i className="fa-solid fa-eye"></i></button>
                          :
                          <button className='tableButton button--flash' onClick={() => handleModal(message)}><i className="fa-solid fa-eye"></i></button>
                        }
                        <button className='tableButton button--red' onClick={() => handleDelete(message.id, true)} ><i className="fa-solid fa-xmark"></i></button>
                      </td>
                    </tr>
                  )
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>

          <button className='greenButton archiveButton' onClick={handleArchiveMessage}>Messages archivés</button>

          {showArchivedMessages ?
            allMessages.filter((message) => message.deletionDate).length <= 0 ?
              <p className='noDataTable'>Aucun message archivé</p>
              :
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sujet</th>
                    <th>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {allMessages.filter((message) => message.deletionDate).sort(compareMessagesByDate).map((message) => {
                    const formattedDate = `${new Date(message.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} - ${new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`;

                    if (message.deletionDate) {
                      return (
                        <tr key={message.id}>
                          <td>{formattedDate}</td>
                          <td>{message.subject}</td>
                          <td className='buttonCell'>
                            {message.isRead ?
                              <button className='tableButton button--static' onClick={() => handleModal(message)}><i className="fa-solid fa-eye"></i></button>
                              :
                              <button className='tableButton button--flash' onClick={() => handleModal(message)}><i className="fa-solid fa-eye"></i></button>
                            }
                            <button className='tableButton button--blue' onClick={() => handleDelete(message.id, false)}><i className="fa-solid fa-arrows-rotate"></i></button>
                          </td>
                        </tr>
                      )
                    } else {
                      return null;
                    }
                  })}
                </tbody>
              </table>
            : null}


          <Modal showModal={showModal} setShowModal={setShowModal}>
            <div className='modal messageModal'>
                <button className='closeButton' onClick={() => setShowModal(false)}><i className="fa-solid fa-square-xmark"></i></button>
              <div className='modal__header'>
                <h2 className='modal__header__title'>{selectedMessage.subject}</h2>
              </div>
              <p>
                {`${new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - ${new Date(selectedMessage.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}`}
              </p>

              <div className='separator'></div>

              <div>
                <p className='messageModal__content'>{selectedMessage.content}</p>
              </div>

              <h3 className='messageModal__contact'>Contact</h3>
              <ul>
                <li>{selectedMessage.firstname} {selectedMessage.lastname}</li>
                <li>{selectedMessage.mail}</li>
                <a href={`mailto://${selectedMessage.mail}?subject=RE: ${selectedMessage.subject}`} className='link mailtoLink'>
                  <i className="fa-solid fa-arrows-turn-right fa-flip-vertical mailto"></i> Répondre
                </a>
                <li><a href={`tel:${selectedMessage.phone}`} className='link phoneLink'>
                  <i className="fa-solid fa-phone phoneLinkIcon"></i>
                  {selectedMessage.phone}
                </a></li>
              </ul>

              <button onClick={() => { handleReadMessage(selectedMessage, !selectedMessage.isRead); setShowModal(false) }} className='greenButton readButton'>{!selectedMessage.isRead ? "Marquer le message comme lu" : "Marquer le message comme non lu"}</button>
            </div>
          </Modal>
        </>}
      </div>
    </div>
  )
}
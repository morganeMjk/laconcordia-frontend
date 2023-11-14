import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Helmet } from 'react-helmet';
import { useApi } from '../../../Router';
import MainLoadingScreen from '../../../Components/LoadingScreen/MainLoadingScreen.Component';
import { saveAs } from 'file-saver';
import Modal from '../../../Components/Modal/ModalPdf.Component';

// Page SheetsUser qui renvoi la liste des partitions liées aux instruments pratiqués par l'utilisateur.

export default function SheetsUser(props) {

  const newplugin = defaultLayoutPlugin()


  const [showModal, setShowModal] = useState(false);

  const [selectedSheet, setSelectedSheet] = useState({});

  const { user } = props
  const userId = user.id

  const [noData, setNoData] = useState(false);


  const handleModal = (data) => {
    setSelectedSheet(data);
    setShowModal(true);
  }



  const [sheets, setSheets] = useState([])

  const fetchSheets = async () => {
    const response = await useApi.sheets.GetAll();

    if (response.data.length <= 0) {
      setNoData(true);
    }
    return setSheets(response.data);
  }

  const fetchUserInstruments = async () => {
    // eslint-disable-next-line
    const response = await useApi.userInstruments.GetByUserId({ userId: userId });
    // console.log(response.data.instrumentId)
  }

  useEffect(() => {
    fetchSheets();
    fetchUserInstruments();
    // eslint-disable-next-line
  }, []);


  const [searchQuery, setSearchQuery] = useState('');




  const filteredSheets = sheets.filter((sheet) => {
    const titleMatch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase());
    const artistMatch = sheet.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || artistMatch;
  });

  const sortedInstruments = user.userInstruments ? user.userInstruments.sort((a, b) => a.label.localeCompare(b.label)) : [];

  const sortedSheets = filteredSheets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));


  const downloadFile = (sheet) => {
    console.log(sheet)
    const url = `${useApi.baseUrl}/images/${sheet.sheetFile}`;
    saveAs(url, sheet.title);
  }

  return (
    <div className='tablePage'>
      <Helmet><title>La Concordia - Partitions</title></Helmet>

      <div id='category'>
        <h2>Mes partitions</h2>
        <h3>Consultez et téléchargez vos partitions</h3>
      </div>


      <div className='tablePage__content'>

        {noData ? <p>Aucune partition à afficher</p> : !user.userInstruments || sheets.length <= 0 ? <MainLoadingScreen /> :
          <>

            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une partition" className='searchInput' />


            <div className='tablePage__content'>
              {sortedInstruments.map((instrument, key) => {
                const instrumentSheets = sortedSheets.filter((sheet) => sheet.instrumentId === instrument.id);

                if (instrumentSheets.length > 0) {
                  return (
                    <div key={key} className='tabelPage__content'>
                      <h2>{instrument.label}</h2>
                      <div className='separator'></div>
                      <table className='sheetTable'>
                        <thead>
                          <tr>
                            <th>Titre</th>
                            <th>Artiste</th>
                            <th>Partition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {instrumentSheets.map((sheet, index) => (
                            <tr key={index}>
                              <td>{sheet.title}</td>
                              <td>{sheet.artist}</td>
                              <td >
                                <div className='buttonCell'>
                                  <button onClick={() => handleModal(sheet)} className='tableButton'>
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                                  <button className='tableButton' onClick={() => downloadFile(sheet)}>
                                    <i className="fa-solid fa-file-arrow-down"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } else {
                  return null;
                }
              })}

              <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='modal'>
                  <button className='closeButton' onClick={() => setShowModal(false)}><i className="fa-solid fa-square-xmark"></i></button>
                  <div className='modal__header'>
                    <h2>{selectedSheet.title}</h2>
                  </div>
                  <p>{selectedSheet.artist}</p>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div
                      style={{
                        height: '450px',
                        width: '700px',
                        padding: '20px 0px',
                        backgroundColor: 'none',
                      }}>
                      <Viewer
                        fileUrl={`${useApi.baseUrl}/images/${selectedSheet.sheetFile}`}
                        plugins={[newplugin]}
                      />
                    </div>
                  </Worker>
                </div>
              </Modal>
            </div>
          </>}
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useApi } from '../../Router';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen.Component';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

const FilterComponent = ({ filterText, onFilter, onClear }) => {
  return (
    <>
      <input
        id="search"
        type='text'
        placeholder="Filter By Name"
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter} />
      <button type="button" onClick={onClear} className='undoButton'><i className="fa-solid fa-square-xmark"></i></button>
    </>
  )
}

export default function UsersUpdate() {

  const [allUsers, setAllUsers] = useState([])

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const fetchAllUsers = async () => {
    const response = await useApi.user.GetAll();
    return setAllUsers(response.data);
  }

  useEffect(() => {
    fetchAllUsers()
  }, []);

  const navigate = useNavigate();



  const columns = [
    {
      name: 'Nom',
      selector: row => row.lastName,
      sortable: true,
    },
    {
      name: 'Prénom',
      selector: row => row.firstName,
      sortable: true,
    },
    {
      name: 'Status',
      style: {
        width: 10 + 'px',
      },
      selector: row => row.deletionDate,
      cell: row => <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50 + '%',
        padding: 8 + 'px',
        width: 8 + 'px',
        height: 8 + 'px',
        backgroundColor: row.deletionDate ? 'red' : 'green',
      }}>
        {!row.deletionDate ?
          <i style={{ color: 'white', fontSize: 12 + 'px' }} className='fas fa-check'></i>
          :
          <i style={{ color: 'white', fontSize: 12 + 'px' }} className='fas fa-xmark'></i>
        }
      </div>,
      sortable: true,
    }
  ];

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);



  if (!allUsers) {
    return <LoadingScreen />
  }

  const filteredItems = allUsers.filter((item) =>
    (item.firstName && item.lastName) && (item.firstName.toLowerCase().includes(filterText.toLowerCase()) || item.lastName.toLowerCase().includes(filterText.toLowerCase())),
  );
 

  return (
    <div className='tablePage'>
      <Helmet><title>La Concordia - Gestion des utilisteurs</title></Helmet>

      {!allUsers || allUsers.length === 0 ? <LoadingScreen /> : <>
        <div id='category'>
          <h2>Gestion des utilisateurs</h2>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          highlightOnHover
          pointerOnHover
          onRowClicked={(row) => navigate(`./${row.id}`)}
          // customStyles={customStyles}
          overflowX='hidden'
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
        />
      </>}
    </div>
  )
}
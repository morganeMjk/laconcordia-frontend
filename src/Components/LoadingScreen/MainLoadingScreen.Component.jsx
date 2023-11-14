import React from 'react';
import ReactLoading from 'react-loading';

const MainLoadingScreen = ({ type, color }) => (
    <div className='mainLoadingScreen'>
        <ReactLoading type='bubbles' color='rgb(32, 32, 32)' />
    </div>
);

export default MainLoadingScreen;
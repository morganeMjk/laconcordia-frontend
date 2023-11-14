import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#modalElement')

const customStyles = {
  content: {
    width: 'fit-content',
    height: 'fit-content',
    margin: 'auto',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  }
};


export default function Modal(props) {
  const { showModal } = props;


  return (
    <ReactModal isOpen={showModal} style={customStyles}>
      {props.children}
    </ReactModal>
  )
}

import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#modalElement')

const customStyles = {
  content: {
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zindex: '999'

  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zindex: '999'
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

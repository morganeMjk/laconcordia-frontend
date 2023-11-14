import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#modalElement')

const customStyles = {
  content: {
    width: 'fit-content',
    height: 'fit-content',
    margin: 'auto',
    backgroundColor: 'rgba(217, 217, 217)',
    zIndex: '999',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: '999',
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

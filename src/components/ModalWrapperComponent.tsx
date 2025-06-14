import {forwardRef, useImperativeHandle, useState} from "react";

type ModalWrapperProps = {
  content: React.ReactNode;
  openButton: React.ReactNode;
};

export const ModalWrapperComponent = forwardRef(({content, openButton}: ModalWrapperProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useImperativeHandle(ref, () => ({
    closeModal,
  }));

  return (
    <>
      <div onClick={openModal} className="btn-modal">
        {openButton}
      </div>

      {isOpen && (
        <div className="modal">
          <div onClick={closeModal} className="overlay"></div>
          <div className="modal-content" style={{
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {content}
            <button 
              className="close-modal" 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
});
import {forwardRef, useImperativeHandle, useState} from "react";

type ModalWrapperProps = {
  content: React.ReactNode;
  onClose?: () => void;
};

export const ModalWrapperComponent = forwardRef(({content, onClose}: ModalWrapperProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  function closeModal() {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  }

  useImperativeHandle(ref, () => ({
    closeModal: toggleModal,
  }));

  return (
          <>
            {isOpen && (
                    <div className="modal">
                      <div onClick={closeModal} className="overlay"></div>
                      <div className="modal-content">
                        {content}
                        <button className="close-modal" onClick={toggleModal}>
                          Schließen
                        </button>
                      </div>
                    </div>
            )}
          </>
  );
});
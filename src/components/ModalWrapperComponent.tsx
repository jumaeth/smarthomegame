import React, {forwardRef, useImperativeHandle, useState} from "react";

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
    toggleModal,
  }));
  return (
          <>
            {isOpen && (
                    <div className="modal" role="dialog" aria-modal="true">
                      <div className="overlay" onClick={closeModal}/>

                      <div className="modal-window">
                        <button
                                className="close-modal"
                                onClick={closeModal}
                                aria-label="Schliessen"
                        >
                          ×
                        </button>

                        <div className="modal-body">{content}</div>
                      </div>
                    </div>
            )}
          </>
  );
});
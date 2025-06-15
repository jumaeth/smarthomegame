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
                      <div className="modal-content">
                        {content}
                        <button className="close-modal" onClick={closeModal}>
                          Schließen
                        </button>
                      </div>
                    </div>
            )}
          </>
  );
});

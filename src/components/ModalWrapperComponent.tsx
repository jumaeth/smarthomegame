import React, {useState} from "react";

type ModalWrapperProps = {
  content: React.ReactNode;
  openButton: React.ReactNode;
};

export const ModalWrapperComponent: React.FC<ModalWrapperProps> = ({content, openButton}) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
          <>
            <div onClick={toggleModal} className="btn-modal">
              {openButton}
            </div>

            {modal && (
                    <div className="modal">
                      <div onClick={toggleModal} className="overlay"></div>
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
};
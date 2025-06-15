import React, { forwardRef, useImperativeHandle, useState } from "react";

type ModalWrapperProps = {
  content: React.ReactNode;
  openButton: React.ReactNode;
};

export const ModalWrapperComponent = forwardRef<
        { closeModal: () => void },
        ModalWrapperProps
>(({ content, openButton }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useImperativeHandle(ref, () => ({ closeModal }));

  return (
          <>
            <button
                    type="button"
                    className="btn-modal"
                    onClick={openModal}
            >
              {openButton}
            </button>

            {isOpen && (
                    <div className="modal" role="dialog" aria-modal="true">
                      <div className="overlay" onClick={closeModal} />

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

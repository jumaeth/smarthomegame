import Button from "@/components/ui-components/Button";
import {Trans} from "@lingui/react/macro";
import React from "react";

type ModalWrapperProps = {
  content: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ModalWrapperComponent = ({content, isOpen, setIsOpen}: ModalWrapperProps) => {
  if (!isOpen) return null;

  const closeModal = () => setIsOpen(false);

  return (
          <div className="fixed inset-0 z-50">
            <div onClick={closeModal} className="fixed inset-0 bg-[#00000099]"/>
            <div className="absolute top-1/2 left-1/2 w-[600px] h-1/2 transform -translate-x-1/2 -translate-y-[40%] bg-gray-100 p-7 rounded relative">
              {content}
              <Button className="absolute top-2 right-2 px-2 py-1"
                      onClick={closeModal}
                      disabled={false}>
                <Trans>Schliessen</Trans>
              </Button>
            </div>
          </div>
  );
};
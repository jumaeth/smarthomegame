import React, {useEffect, useState} from "react";
import CloseModalButton from "@/components/general-ui/CloseModalButton.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import HelpButton from "@/components/general-ui/HelpButton.tsx";

type BasicModalWrapperProps = {
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showBg?: boolean;
  activeDevice: SmartDevice;
};

export const BasicModalWrapper = ({content, isOpen, onClose, showBg, activeDevice}: BasicModalWrapperProps) => {
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewMessage(true);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
          <>
            {showBg && (
                    <div className="absolute w-full h-full bg-black/75" onClick={onClose}/>
            )}
            <div className="absolute w-full h-full grid items-center justify-items-center" onClick={onClose}>
              <div className="relative h-auto w-auto grid items-center justify-items-center bg-[#3a3a3a] border-4 border-white shadow-[0_0_0_6px_black] z-[100]"
                   onClick={(e) => e.stopPropagation()}>
                <CloseModalButton onClick={onClose} ariaLabel={"Schliessen"}/>
                <div className="h-auto max-h-[85vh] overflow-y-auto w-auto max-w-[85vw] overflow-x-auto px-3 grid grid-cols-1 items-center justify-items-center">
                  {content}
                </div>
              </div>
            </div>
            <div className="absolute">
              <HelpButton newMessage={newMessage} smartDevice={activeDevice}/>
            </div>
          </>

  );
};


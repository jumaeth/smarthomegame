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
          <div className="fixed inset-0">
            {showBg && <div className="overlay" onClick={onClose}/>}
            <div className="invisible ..."></div>
            <div className="col-span-2 bg-black/75 w-full h-full" onClick={onClose}/>
            <HelpButton newMessage={newMessage} smartDevice={activeDevice}/>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a3a3a] border-4 border-white shadow-[0_0_0_6px_black] p-4 max-w-[90vw] max-h-[90vh] text-[18px] leading-[1.4] z-[100] w-auto h-auto rounded-none overflow-visible">
              <CloseModalButton onClick={onClose} ariaLabel={"Schliessen"}>x</CloseModalButton>
              <div className="bg-[#4a4a4a] px-[28px] py-[14px] rounded-[3px]">{content}</div>
            </div>
          </div>
  );
};

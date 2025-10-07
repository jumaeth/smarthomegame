import React, {useEffect, useState} from "react";
import CloseModalButton from "@/components/general-ui/CloseModalButton.tsx";
import AvatarWithSpeach from "@/components/general-ui/AvatarWithSpeach.tsx";
import Avatar from "@/assets/tutorial/explanationPages/pointLeft.png";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {t} from "@lingui/core/macro";

type BasicModalWrapperProps = {
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showBg?: boolean;
  activeDevice?: SmartDevice;
};

export const BasicModalWrapper = ({content, isOpen, onClose, showBg, activeDevice}: BasicModalWrapperProps) => {
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowAvatar(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowAvatar(true);
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const onAvatarClose = () => {
    setShowAvatar(false);
  }

  return (
          <div className="fixed inset-0" role="dialog" aria-modal="true">
            {showBg && <div className="overlay" onClick={onClose} />}
            <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />
          <div className="fixed inset-0">
            {showBg && <div className="overlay" onClick={onClose}/>}
            <div className="invisible ..."></div>
            <div className="col-span-2 bg-black/75 w-full h-full" onClick={onClose}/>
            {showAvatar && (
                    <AvatarWithSpeach
                            src={Avatar}
                            info={"wow interesting task you got there, do you need help with anything?"}
                            helpText={activeDevice ? activeDevice.getHelpText() : t`this is more difficult than i thought, unfortunately I cannot support you with this.`}
                            onClose={onAvatarClose}
                    />
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a3a3a] border-4 border-white shadow-[0_0_0_6px_black] p-4 max-w-[90vw] text-[18px] leading-[1.4] z-[100] w-auto h-auto rounded-none overflow-visible">
              <button className="absolute top-[15px] right-[15px] w-[30px] h-[30px] p-[0px] pb-[6px] flex items-center justify-center bg-black border-none cursor-pointer text-[42px] leading-none text-white" onClick={onClose} aria-label="Schliessen">
                ×
              </button>
              <div className="bg-[#4a4a4a] px-[28px] py-[14px] rounded-[3px]">
                {content}
              </div>
              <CloseModalButton onClick={onClose} ariaLabel={"Schliessen"}>x</CloseModalButton>
              <div className="bg-[#4a4a4a] px-[28px] py-[14px] rounded-[3px]">{content}</div>
            </div>
          </div>
  );
};

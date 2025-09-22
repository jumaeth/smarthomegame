import React from "react";
import ButtonCloseModal from "@/components/general-ui/ButtonCloseModal.tsx";
import AvatarWithSpeach from "@/components/general-ui/AvatarWithSpeach.tsx";
import LlmAvatar from "@/assets/llm-chatbot/llm_chatbot_profile_picture.png";

type BasicModalWrapperProps = {
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showBg?: boolean
};

export const BasicModalWrapper = ({ content, isOpen, onClose, showBg }: BasicModalWrapperProps) => {
  if (!isOpen) return null;

  return (
          <div className="fixed inset-0">
            {showBg && <div className="overlay" onClick={onClose} />}
            <div className="invisible ..."></div>
            <div className="col-span-2 bg-black/75 w-full h-full" onClick={onClose}/>
            <AvatarWithSpeach src={LlmAvatar}
                              info={"wow interesting task you got there, do you need help with anything?"}/>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a3a3a] border-4 border-white shadow-[0_0_0_6px_black] p-4 max-w-[90vw] text-[18px] leading-[1.4] z-[100] w-auto h-auto rounded-none overflow-visible">
              <ButtonCloseModal onClick={onClose} ariaLabel={"Schliessen"}>x</ButtonCloseModal>
              <div className="bg-[#4a4a4a] px-[28px] py-[14px] rounded-[3px]">{content}</div>
            </div>
          </div>
  );
};

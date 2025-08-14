import React from "react";

type BasicModalWrapperProps = {
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const BasicModalWrapper = ({ content, isOpen, onClose }: BasicModalWrapperProps) => {
  if (!isOpen) return null;

  return (
          <div className="fixed inset-0" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a3a3a] border-4 border-white shadow-[0_0_0_6px_black] p-4 max-w-[90vw] text-[18px] leading-[1.4] z-[100] w-auto h-auto rounded-none overflow-visible">
              <button className="absolute top-[15px] right-[15px] w-[30px] h-[30px] p-[0px] pb-[6px] flex items-center justify-center bg-black border-none cursor-pointer text-[42px] leading-none text-white" onClick={onClose} aria-label="Schliessen">
                ×
              </button>
              <div className="bg-[#4a4a4a] px-[28px] py-[14px] rounded-[3px]">
                {content}
              </div>
            </div>
          </div>
  );
};

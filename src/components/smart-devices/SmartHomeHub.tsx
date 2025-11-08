import {Trans} from "@lingui/react/macro";
import React, {useState} from 'react';
import {DataSortingGame} from '../dataSortingGame/DataSortingGame';
import Button from "@/components/general-ui/Button.tsx";


interface SmartHomeHubProps {
  completeDevice: () => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({completeDevice}) => {
  // Use a state to control the view: 0 = Intro, 1 = Game Modal
  const [frame, setFrame] = useState(0);

  const handleGameComplete = () => {
    completeDevice();
  };
  const closeModal = () => {
    setFrame(0);
  };
  const isGameModalOpen = frame === 1;

  React.useEffect(() => {
    if (isGameModalOpen) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
    return () => {
      document.body.classList.remove('active-modal');
    };
  }, [isGameModalOpen]);


  return (
          <div>
            {frame === 0 && (
                    <div className="flex flex-col items-center justify-center p-4">

                      <h1 className="text-white text-3xl font-bold mb-8">
                        <Trans>Smart Home Hub</Trans></h1>

                      {/* White Rectangular Info Box */}
                      <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
                        <p className="leading-relaxed">
                          <Trans>Your data permissions are all mixed up! Your Smart Home App has access to all data
                            files in your personal cloud.
                            Decide which information about you is too private, and unnecessary for your Smart Home to
                            function.</Trans>
                        </p>
                      </div>

                      <div className={"grid justify-center"}>
                        <Button
                                onClick={() => {
                                  setFrame(1)
                                }}
                                className={"px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700 " +
                                        "rounded-[30px] shadow-md transition-colors cursor-pointer"}
                        >
                          <Trans>Continue</Trans>
                        </Button>
                      </div>
                    </div>
            )}

            {/* Game Modal (Frame 1) */}
            {isGameModalOpen && (
                    <div className="text-white fixed inset-0 z-[99] flex items-center justify-center font-['LoResBold',sans-serif] pb-[15px]">

                      <div className="absolute inset-0 bg-black/75" onClick={closeModal}/>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a3a3a] border-[4px] border-white shadow-[0_0_0_6px_#000]
                      px-[30px] py-[12px] text-lg leading-normal flex flex-col">

                        <button
                                className="absolute top-[15px] right-[15px] box-border w-[30px] h-[30px] p-[0_0_6px_0]
                                       flex items-center justify-center bg-black border-none cursor-pointer
                                       text-[42px] leading-none text-white z-[101]"
                                onClick={closeModal}>
                          &times;
                        </button>

                        <h1 className="text-3xl text-center">
                          <Trans>Data Sorting Challenge</Trans>
                        </h1>

                        <div className="p-[14px] px-[28px] mb-4">
                          <DataSortingGame onCompletion={handleGameComplete}/>
                        </div>

                      </div>
                    </div>
            )}
          </div>
  );
};
import {Trans} from "@lingui/react/macro";
import React, {useState} from 'react';
import {DataSortingGame} from '../dataSortingGame/DataSortingGame';
import Button from "@/components/general-ui/Button.tsx";


interface SmartHomeHubProps {
  completeDevice?: (isCompleted: boolean) => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({completeDevice}) => {
  // Use a state to control the view: 0 = Intro, 1 = Game Modal
  const [frame, setFrame] = useState(0);

  const handleGameComplete = () => {
    completeDevice?.(true);
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
                    <div className="h-full flex flex-col items-center justify-center p-4">

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
                    <div className="h-150 text-white h-full px-[30px] py-[12px] flex flex-col">

                      <h1 className="text-3xl text-center font-['LoResBold',sans-serif]">
                        <Trans>Data Sorting Challenge</Trans>
                      </h1>

                      <p className="text-base text-center text-gray-300 mb-4 mt-2">
                        <Trans>Drag and drop the datapoints to the correct category</Trans>
                      </p>

                      <div className="p-[14px] px-[28px] mb-4">
                        <DataSortingGame onCompletion={handleGameComplete}/>
                      </div>

                    </div>
            )}
          </div>
  );
};
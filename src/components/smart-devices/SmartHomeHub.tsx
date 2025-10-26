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

                      <h1 className="text-white text-2xl font-bold mb-8">
                        <Trans>Smart Home Hub</Trans></h1>

                      {/* White Rectangular Info Box */}
                      <div className="modal-info-box">
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
                                className={"btn-modal-primary"}
                        >
                          <Trans>Continue</Trans>
                        </Button>
                      </div>
                    </div>
            )}

            {/* Game Modal (Frame 1) */}
            {isGameModalOpen && (
                    <div className="modal">
                      <div className="overlay" onClick={closeModal}/>
                      <div className="modal-window">
                        <button className="close-modal" onClick={closeModal}>&times;</button>
                        <h1><Trans>Data Sorting Challenge</Trans></h1>
                        <div className="modal-content p-0 m-0 bg-transparent">
                          <DataSortingGame onCompletion={handleGameComplete}/>
                        </div>
                      </div>
                    </div>
            )}
          </div>
  );
};
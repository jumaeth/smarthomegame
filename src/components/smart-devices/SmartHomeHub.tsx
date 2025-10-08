import {Trans} from "@lingui/react/macro";
import React, {useState} from 'react';
import {DataSortingGame} from '../dataSortingGame/DataSortingGame';
import Button from "@/components/general-ui/Button.tsx";

interface SmartHomeHubProps {
  completeDevice: () => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({ completeDevice }) => {
  const handleGameComplete = () => {completeDevice();};
  const [frame, setFrame] = useState(0);

  return (
          <div>
            <h1><Trans>smart home hub</Trans></h1>
            {frame == 0 &&(
                    <div className="grid grid-cols-1">
                      <b><Trans>Your data permissions are all mixed up! Your Smart Home App has access to all data files in your personal cloud. Decide which information about you is too private, and unnecessary for your Smart Home to function.</Trans></b>
                      <div className={"grid justify-center"}>
                        <Button onClick={()=>{setFrame(1)}}><Trans>continue</Trans></Button>
                      </div>
                    </div>

            )}
            {frame == 1 &&(
                    <div className="p-6 m-4 bg-gray-100 rounded-xl shadow-md w-full h-full">
                      <div className="w-full h-[calc(100vh-100px)] min-h-[500px]">
                        <DataSortingGame onCompletion={handleGameComplete} />
                      </div>
                    </div>
            )}
          </div>
  );
}; 
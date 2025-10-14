import React from 'react';
import {DataSortingGame} from '../dataSortingGame/DataSortingGame';

interface SmartHomeHubProps {
  completeDevice: () => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({ completeDevice }) => {
  const handleGameComplete = () => {
    completeDevice();
  };

  return (
    <div className="p-6 m-4 bg-transparent mx-auto w-full">
      <div className="relative w-full aspect-[16/9] min-h-[420px]">
        <DataSortingGame onCompletion={handleGameComplete} />
      </div>
    </div>
  );
}; 
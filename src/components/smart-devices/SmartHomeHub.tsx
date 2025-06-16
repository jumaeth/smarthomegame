import React from 'react';
import {DataSortingGame} from '../dataSortingGame/DataSortingGame';

interface SmartHomeHubProps {
  onCompletion: (isCompleted: boolean) => void;
}

export const SmartHomeHub: React.FC<SmartHomeHubProps> = ({ onCompletion }) => {
  const handleGameComplete = () => {
    onCompletion(true);
  };

  return (
    <div className="p-6 m-4 bg-gray-100 rounded-xl shadow-md w-full h-full">
      <div className="w-full h-[calc(100vh-100px)] min-h-[500px]">
        <DataSortingGame onCompletion={handleGameComplete} />
      </div>
    </div>
  );
}; 
import React from 'react';
import {SecurityCameraGame} from "@/components/cameraGame/SecurityCameraGame.tsx";

interface SecurityCaneraProps {
  completeDevice?: (isCompleted: boolean) => void;
}

export const SecurityCamera: React.FC<SecurityCaneraProps> = ({ completeDevice}) => {

  const handleGameComplete = () => {
    completeDevice?.(true);
  };


  return (
          <div>
            <SecurityCameraGame onCompletion={handleGameComplete} />
          </div>
  );
};
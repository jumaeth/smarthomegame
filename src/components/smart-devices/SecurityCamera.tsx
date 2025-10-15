import "./Modal.css";
import React from 'react';
import {SecurityCameraGame} from "@/components/cameraGame/SecurityCameraGame.tsx";

interface SecurityCaneraProps {
  completeDevice: () => void;
}

export const SecurityCamera: React.FC<SecurityCaneraProps> = ({ completeDevice}) => {

  const handleGameComplete = () => {
    completeDevice();
  };


  return (
          <div>
            <SecurityCameraGame onCompletion={handleGameComplete} />
          </div>
  );
};
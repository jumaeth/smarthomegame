import { CookingGameComponent } from "../cookingGame/CookingGameComponent.tsx";
import "./Modal.css";
import React from 'react';

interface SmartKitchenProps {
  completeDevice: () => void;
}

export const SmartKitchen: React.FC<SmartKitchenProps> = ({ completeDevice}) => {

  const handleGameComplete = () => {
    completeDevice();
  };


  return (
          <div>
            <CookingGameComponent onCompletion={handleGameComplete}/>
          </div>
  );
};

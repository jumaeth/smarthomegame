import { CookingGameComponent } from "../cookingGame/CookingGameComponent.tsx";
import "./Modal.css";
import React from 'react';

interface SmartKitchenProps {
  onCompletion: (isCompleted: boolean) => void;
}

export const SmartKitchen: React.FC<SmartKitchenProps> = ({ onCompletion}) => {

  const handleGameComplete = () => {
    onCompletion(true);
  };


  return (
          <div>
            <CookingGameComponent onCompletion={handleGameComplete} />
          </div>
  );
};

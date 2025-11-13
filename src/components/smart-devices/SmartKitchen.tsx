import { CookingGameComponent } from "../cookingGame/CookingGameComponent.tsx";
import React from 'react';

interface SmartKitchenProps {
  completeDevice?: (isCompleted: boolean) => void;
}

export const SmartKitchen: React.FC<SmartKitchenProps> = ({ completeDevice}) => {

  const handleGameComplete = () => {
    completeDevice?.(true);
  };


  return (
          <div>
            <CookingGameComponent onCompletion={handleGameComplete} />
          </div>
  );
};

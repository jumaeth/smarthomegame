import { useContext } from "react";
import { GameContext } from "../../context/GameContext.tsx";

export const useGameService = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameService must be used within a GameProvider");
  }
  return context;
};
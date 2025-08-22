import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useGameService = () => {
  const context = useContext(GameContext);
  console.log("useGameService", context);
  if (!context) {
    throw new Error("useGameService must be used within a GameProvider");
  }
  return context;
};
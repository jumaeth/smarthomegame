import React, {createContext, useContext} from "react";
import {GameService} from "../services/GameService";

const GameContext = createContext<GameService | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const gameService = new GameService();
  return <GameContext.Provider value={gameService}>{children}</GameContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameService = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameService must be used within a GameProvider");
  }
  return context;
};
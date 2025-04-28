import { ReactNode } from "react";
import { GameContext } from "./GameContext";
import { GameService } from "../services/GameService";
import {useNavigate} from "react-router-dom";

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const navigate = useNavigate();
  const gameService = new GameService(navigate);

  return (
          <GameContext.Provider value={gameService}>
            {children}
          </GameContext.Provider>
  );
};
import { createContext } from "react";
import { GameService } from "../services/GameService";

export const GameContext = createContext<GameService | null>(null);
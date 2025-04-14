import {useState} from 'react';
import {useGameService} from '../context/GameContext';

export function GameOver() {
  const [gameOverMessage, setGameOverMessage] = useState("Gratulation, du hast gewonnen");
  const gameResetLabel = "Spiel zurücksetzen";
  const gameService = useGameService();

  return (
          <div className="GameOverPage">
            <h2>{gameOverMessage}</h2>
            <button onClick={() => gameService.reset()}>
              {gameResetLabel}
            </button>
          </div>
  );
}

import {useGameService} from "../hooks/useGameService.tsx";

export function GameOver() {
  const gameOverMessage = "Gratulation, du hast gewonnen";
  const gameResetLabel = "Zur Homepage";
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

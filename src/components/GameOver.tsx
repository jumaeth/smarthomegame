import { useState } from 'react'
import GameService from './GameService'

export function GameOver()  {
    const [gameOverMessage, setGameOverMessage] = useState("Gratulation, du hast gewonnen");
    const gameResetLabel = "Spiel zurücksetzen";

    return (
        <div className="GameOverPage">
            <h2>{gameOverMessage}</h2>
            <button onClick={() => GameService.reset()}>
                {gameResetLabel}
            </button>
        </div>
    )
}

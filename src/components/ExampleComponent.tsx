import {useGameService} from "../context/GameContext";
import {useNavigate} from "react-router-dom";

export const ExampleComponent = () => {
  const gameService = useGameService();
  const navigate = useNavigate();

  const handleStartGame = () => {
    console.log(gameService.checkGameCompletionConditions());
  };

  return (
          <div>
            <h2>Example Component</h2>
            <button onClick={handleStartGame}>Start Game</button>
            <button onClick={() => navigate('/game/game-over')}>Zum Game Over</button>

          </div>
  );
};
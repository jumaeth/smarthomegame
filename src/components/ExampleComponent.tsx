import {useGameService} from "../context/GameContext";

export const ExampleComponent = () => {
    const gameService = useGameService();

    const handleStartGame = () => {
        gameService.startGame();
    };

    return (
        <div>
            <h2>Example Component</h2>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};
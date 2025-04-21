const GameService = {
  reset: () => {
    // Reset game logic here
    console.log("Game has been reset");
    return true;
  },
  updateScore: (delta: number) => {
    console.log("Score has changed by " + delta)
  },
  startGame: () => {
    console.log("Game has been started")
  }
};
export default GameService
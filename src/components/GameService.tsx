const GameService = {
    reset: () => {
        // Reset game logic here
        console.log("Game has been reset");
        return true;
    },
    updateScore:(delta : number)=>{
      console.log("Score has changed by " + delta)
    }
};
export default GameService
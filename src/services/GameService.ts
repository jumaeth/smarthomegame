import {Game} from "../objects/Game.ts";
import {Room} from "../objects/Room.ts";
import {SmartDevice} from "../objects/SmartDevice.ts";
import {useNavigate} from "react-router-dom";

export class GameService {
  private game: Game | null;
  private navigate = useNavigate();

  constructor() {
    const rooms = [
      new Room("Living Room", "/game/living-room", "LivingRoomComponent", [
        new SmartDevice("TV"),
        new SmartDevice("Lamp"),
      ]),
      new Room("Kitchen", "/game/kitchen", "KitchenComponent", [
        new SmartDevice("Fridge"),
        new SmartDevice("Oven"),
      ]),
    ];

    this.game = new Game(rooms);
    console.log(this.game);
  }

  startGame(): boolean {
    // Reset game logic here
    console.log("Game room amounts " + this.game?.rooms.length);
    return true;
  }

  completeRoom(roomName: string) {
    if (!this.game) return;

    const room = this.game.rooms.find((r) => r.name === roomName);
    if (room) {
      room.completed = true;
      if (this.checkGameCompletionConditions()) {
        this.finishGame();
      } else {
        this.continueGame();
      }
    }
  }

  checkGameCompletionConditions(): boolean {
    if (!this.game) {
      return false
    }
    return this.game.rooms.every((room) => room.completed);
  }

  getDeviceForRoom(roomName: string) {
    if (!this.game) {
      return [];
    }
    const room = this.game.rooms.find((room) => room.name === roomName);
    return room ? room.devices : [];
  }

  reset(): boolean {
    // Reset game logic here
    this.game = null;
    this.navigate('/game');
    return true;
  }

  finishGame() {
    this.navigate('/game/game-over');

  }

  continueGame() {
    // this.navigate('/game/house');
  }
}
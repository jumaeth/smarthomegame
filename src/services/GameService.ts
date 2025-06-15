import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";

export class GameService {
  private game: Game | null;
  private navigate: (path: string) => void;

  constructor(navigate: (path: string) => void) {
    this.game = new Game(this.setUpRooms());
    this.navigate = navigate;
  }

  setUpRooms(): Room[] {
    return [
      new Room("livingroom", "/game/livingroom", "LivingRoomComponent", [
        new SmartDevice("SmartTv"),
        new SmartDevice("SmartLights"),
        new SmartDevice("SmartHomeHub"),
      ]),
      new Room("kitchen", "/game/kitchen", "KitchenComponent", []),
    ];
  }

  completeRoom(roomName: string) {
    if (!this.game) return;

    const room = this.game.rooms.find((r) => r.name === roomName);
    if (room) {
      room.isCompleted = true;
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
    return this.game.rooms.every((room) => room.isCompleted);
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
    this.navigate('/');
    return true;
  }

  finishGame() {
    this.navigate('/game/game-over');

  }

  continueGame() {
    this.navigate('/game');
  }

  getRooms() {
    return this.game?.rooms
  }

  toogleRoomIsLocked(roomName: string) {

    if (!this.game) {
      return;
    }

    const room = this.game.rooms.find((r) => r.name === roomName);
    if (room) {
      room.isLocked = !room.isLocked;

    }
  }

  leaveRoom(roomName: string):boolean {
    if (!this.game) {
      return false;
    }

    const room = this.game.rooms.find((r) => r.name === roomName);
    if (room?.isLocked == false) {
      this.navigate('/game');
    }
    return true;
  }
}
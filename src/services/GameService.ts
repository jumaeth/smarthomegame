import {Game} from "../objects/Game";
import {Room, RoomName} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore.ts";

export class GameService {
  private game: Game;
  private navigate: (path: string) => void;

  constructor(navigate: (path: string) => void) {
    this.game = new Game(this.setUpRooms());
    this.navigate = navigate;
  }

  setUpRooms(): Room[] {
    return [
      new Room("livingroom", [
        new SmartDevice("SmartTv"),
        new SmartDevice("SmartLights"),
        new SmartDevice("SecurityCamera")
      ]),
      new Room("kitchen", [
        new SmartDevice("SmartHomeHub"),
        new SmartDevice("SmartKitchen"),
        new SmartDevice("SecurityCamera"),
      ]),
    ];
  }

  findRoomByName(roomName: RoomName): Room | undefined {
    return this.game.getRooms().find((r: Room): boolean => r.name === roomName);
  }

  completeRoom(roomName: RoomName): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (!room) return;
    room.complete();
    this.navigateAfterComplete();
  }

  navigateAfterComplete(): void {
    if (this.checkGameCompletionConditions()) {
      this.finishGame();
    } else {
      this.continueGame();
    }
  }

  checkGameCompletionConditions(): boolean {
    return this.game.getRooms().every((room: Room): boolean => room.isCompleted);
  }

  getDeviceForRoom(roomName: RoomName): SmartDevice[] {
    const room: Room | undefined = this.findRoomByName(roomName);
    return room ? room.devices : [];
  }

  reset(): boolean {
    this.game = new Game(this.setUpRooms());
    this.navigate('/');
    return true;
  }

  finishGame(): void {
    this.navigate('/game/game-over');
  }

  continueGame(): void {
    this.navigate('/game');
  }

  toogleRoomIsLocked(roomName: RoomName): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room) room.toggleIsLocked();
  }

  leaveRoom(roomName: RoomName): boolean {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room?.isLocked == false) {
      this.navigate('/game');
    }
    return true;
  }

  changeScore(scoreDelta: number, scoreType: ScoreType): void {
    if (scoreType === 'privacy') this.game.modifyScore(scoreDelta, 0);
    if (scoreType === 'comfort') this.game.modifyScore(0, scoreDelta);
  }

  getScore():GameScore {
    return this.game.getScore();
  }
}
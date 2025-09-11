import {Game} from "../objects/Game";
import {Room, RoomName} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore.ts";
import {CookieService} from "@/services/CookieService.ts";
import {allRoomStore} from "@/utils/roomStore.ts";

type DeviceListener = (device: SmartDevice) => void;

export class GameService {
  private game: Game;
  private navigate: (path: string) => void;
  private deviceListeners = new Set<DeviceListener>();

  constructor(navigate: (path: string) => void) {
    const saveGame = CookieService.get<Game>('save_game');
    if (saveGame) {
      const game = Game.fromSerialized(saveGame);
      this.game = game;
      allRoomStore.set(game.getRooms());
    } else {
      const newRooms = this.setUpRooms();
      this.game = new Game(newRooms);
      if (allRoomStore.getAll().length === 0) allRoomStore.set(newRooms);
    }
    this.navigate = navigate;
  }

  onGameStateChange(): void {
    CookieService.set("save_game", {
      rooms:  allRoomStore.getAll().map(r => r.toSerialized()),
      score: this.game.getScore().toSerialized(),
    });
  }

  setUpRooms(): Room[] {

    const livingRoom = new Room("livingroom",[
      new SmartDevice("SmartTv"),
      new SmartDevice("SmartLights")
    ]);

    const kitchen= new Room("kitchen",[
      new SmartDevice("SmartHomeHub"),
      new SmartDevice("SmartKitchen"),
      new SmartDevice("SecurityCamera"),
    ]);

    return [livingRoom, kitchen];
  }

  getAllRooms(): Room[] {
    return allRoomStore.getAll();
  }

  findRoomByName(roomName: RoomName): Room | undefined {
    return allRoomStore.getRoom(roomName);
  }

  completeRoom(roomName: RoomName): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (!room) return;
    room.complete();
    this.navigateAfterComplete();
    this.onGameStateChange();
  }

  navigateAfterComplete(): void {
    if (this.checkGameCompletionConditions()) {
      this.finishGame();
    } else {
      this.continueGame();
    }
  }

  checkGameCompletionConditions(): boolean {
    return allRoomStore.getAll().every((room: Room) => room.isCompleted);
  }

  getDeviceForRoom(roomName: RoomName): SmartDevice[] {
    const room: Room | undefined = this.findRoomByName(roomName);
    return room ? room.devices : [];
  }

  reset(): boolean {
    const newRooms = this.setUpRooms();
    this.game = new Game(newRooms);
    allRoomStore.set(newRooms);
    this.navigate('/');
    this.onGameStateChange();
    return true;
  }

  finishGame(): void {
    this.navigate('/game/game-over');
  }

  continueGame(): void {
    this.navigate('/game');
  }

  pauseGame(): void {
    //TODO
  }

  resumeGame(): void {
    //TODO
  }

  toogleRoomIsLocked(roomName: RoomName): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room) room.toggleIsLocked();
    this.onGameStateChange();
  }

  leaveRoom(roomName: RoomName): boolean {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room?.isLocked == false) {
      this.navigate('/game');
      this.onGameStateChange();
    }
    return true;
  }

  changeScore(scoreDelta: number, scoreType: ScoreType): void {
    if (scoreType === 'privacy') this.game.modifyScore(scoreDelta, 0);
    if (scoreType === 'comfort') this.game.modifyScore(0, scoreDelta);
    this.onGameStateChange();
  }

  getScore():GameScore {
    return this.game.getScore();
  }

  completeDevice(name: String): void {
    const device = allRoomStore.getDevice(name);
    if (device){
      device.complete();
      this.deviceListeners.forEach(cb => cb(device));
      this.onGameStateChange();
    }
  }

  onDeviceStateChanged(listener: DeviceListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }
}
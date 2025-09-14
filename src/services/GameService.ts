import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {RoomNames} from "../objects/RoomNames";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore.ts";
import {CookieService} from "@/services/CookieService.ts";
import {movementStore} from "@/utils/movementEnabled.ts";

type Listener = (paused: boolean) => void;

export class GameService {
  private game: Game;
  private navigate: (path: string) => void;
  private paused: boolean = false;
  private pauseListeners  = new Set<Listener>();
  private smartDevicesEnabled = true;
  private smartDevicesEnabledListeners  = new Set<Listener>();


  constructor(navigate: (path: string) => void) {
    const saveGame = CookieService.get<Game>('save_game');
    const savedGame = saveGame ? Game.fromSerialized(saveGame) : null;
    this.game = savedGame ? Game.fromSerialized(savedGame) : new Game(this.setUpRooms());
    this.navigate = navigate;
  }

  onGameStateChange(): void {
    CookieService.set("save_game", this.game);
  }

  setUpRooms(): Room[] {
    return [
      new Room(RoomNames.LIVINGROOM, [
        new SmartDevice("SmartTv"),
        new SmartDevice("SmartLights"),
        new SmartDevice("SecurityCamera")
      ]),
      new Room(RoomNames.KITCHEN, [
        new SmartDevice("SmartHomeHub"),
        new SmartDevice("SmartKitchen"),
        new SmartDevice("SecurityCamera"),
      ]),
    ];
  }

  findRoomByName(roomName: RoomNames): Room | undefined {
    return this.game.getRooms().find((r: Room): boolean => r.name === roomName);
  }

  completeRoom(roomName: RoomNames): void {
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
    return this.game.getRooms().every((room: Room): boolean => room.isCompleted);
  }

  getDeviceForRoom(roomName: RoomNames): SmartDevice[] {
    const room: Room | undefined = this.findRoomByName(roomName);
    return room ? room.devices : [];
  }

  reset(): boolean {
    this.game = new Game(this.setUpRooms());
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
    this.paused = true;
    if (movementStore.getSnapshot().movementEnabled){
      movementStore.disable();
    }
    this.emitPause();

  }

  resumeGame(): void {
    this.paused = false;
    if (!movementStore.getSnapshot().movementEnabled){
      movementStore.enable();
    }
    this.emitPause();
  }

  disableSmartDevices(): void {
    this.smartDevicesEnabled = false;
    this.emitSmartDevicesEnable();
  }

  enableSmartDevices(): void {
    this.smartDevicesEnabled = true;
    this.emitSmartDevicesEnable();
  }

  toogleRoomIsLocked(roomName: RoomNames): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room) room.toggleIsLocked();
    this.onGameStateChange();
  }

  leaveRoom(roomName: RoomNames): boolean {
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

  isPaused(): boolean {
    return this.paused;
  }

  areSmartDevicesEnabled(): boolean {
    return this.smartDevicesEnabled;
  }

  subscribeSmartDevicesEnabled(listener: Listener): () => void {
    this.smartDevicesEnabledListeners.add(listener);
    listener(this.smartDevicesEnabled);

    return () => {
      this.smartDevicesEnabledListeners.delete(listener);
    };

  }

  subscribePause(listener: Listener): () => void {
    this.pauseListeners.add(listener);
    listener(this.paused);

    return () => {
      this.pauseListeners.delete(listener);
    };

  }

  private emitPause() {
    for (const l of this.pauseListeners) l(this.paused);
  }

  private emitSmartDevicesEnable() {
    for (const l of this.smartDevicesEnabledListeners) l(this.smartDevicesEnabled);
  }

  getScore():GameScore {
    return this.game.getScore();
  }
}
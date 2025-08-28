import {Game} from "../objects/Game";
import {Room, RoomName} from "../objects/Room";
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
  private sdEnabled = true;
  private sdEnabledListeners  = new Set<Listener>();


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

  getDeviceForRoom(roomName: RoomName): SmartDevice[] {
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

  disableSD(): void {
    this.sdEnabled = false;
    this.emitSdEnable();
  }

  enableSD(): void {
    this.sdEnabled = true;
    this.emitSdEnable();
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

  isPaused(): boolean {
    return this.paused;
  }

  areSdEnabled(): boolean {
    return this.sdEnabled;
  }

  subscribeSdEnabled(listener: Listener): () => void {
    this.sdEnabledListeners.add(listener);
    listener(this.sdEnabled);

    return () => {
      this.sdEnabledListeners.delete(listener);
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

  private emitSdEnable() {
    for (const l of this.sdEnabledListeners) l(this.sdEnabled);
  }

  getScore():GameScore {
    return this.game.getScore();
  }
}
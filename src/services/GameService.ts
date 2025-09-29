import {Game} from "../objects/Game";
import {Room, RoomName} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore";
import {CookieService} from "@/services/CookieService";
import {allRoomStore} from "@/utils/roomStore";
import {movementStore} from "@/utils/movementEnabled";


type DeviceListener = (device: SmartDevice) => void;
type Listener = (paused: boolean) => void;

export class GameService {
  private game: Game;
  private navigate: (path: string) => void;
  private paused: boolean = false;
  private pauseListeners  = new Set<Listener>();
  private smartDevicesEnabled = true;
  private smartDevicesEnabledListeners  = new Set<Listener>();
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

  private findRoomByName(roomName: RoomName): Room | undefined {
    return allRoomStore.getRoom(roomName);
  }

  completeRoom(roomName: RoomName): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (!room) return;
    room.complete();
    this.navigateAfterComplete();
    this.onGameStateChange();
  }

  private navigateAfterComplete(): void {
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

  completeDevice(name: string): void {
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
import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {RoomNames, roomNameToEnum} from "../objects/RoomNames";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore.ts";
import {CookieService} from "@/services/CookieService.ts";
import {allRoomStore} from "@/utils/roomStore.ts";
import {movementStore} from "@/utils/movementEnabled.ts";
import {tutorialActiveStore} from "@/hooks/gameService/useTutorialActive.ts";
import {MapKey} from "@/types/maps.ts";
import {DoorState} from "@/types/door.ts";


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
  private exitStateListeners = new Set<() => void>();

  constructor(navigate: (path: string) => void) {
    const saveGame = CookieService.get<Game>('save_game');
    const tutorialCookie = CookieService.get<boolean>('tutorialState');
    if (saveGame) {
      const game = Game.fromSerialized(saveGame);
      this.game = game;
      allRoomStore.set(game.getRooms());
      if(tutorialCookie != null)tutorialActiveStore.set(tutorialCookie);
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
    CookieService.set("tutorialState", tutorialActiveStore.get());
  }

  setUpRooms(): Room[] {

    const hallway = new Room(RoomNames.HALLWAY, []);
    hallway.complete();
    hallway.unlockRoom();
    
    const livingRoom = new Room(RoomNames.LIVINGROOM,[
      new SmartDevice("SmartTv"),
      new SmartDevice("SmartLights")
    ]);

    const kitchen= new Room(RoomNames.KITCHEN, [
      new SmartDevice("SmartHomeHub"),
      new SmartDevice("SmartKitchen"),
      new SmartDevice("SecurityCamera"),
    ]);

    return [livingRoom, hallway, kitchen];
  }

  getAllRooms(): Room[] {
    return allRoomStore.getAll();
  }

  findRoomByName(roomName: RoomNames): Room | undefined {
    return allRoomStore.getRoom(roomName);
  }

  completeRoom(roomName: RoomNames): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (!room) return;
    room.complete();
    this.getRoom(roomName).unlockRoom();
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

  getDeviceForRoom(roomName: RoomNames): SmartDevice[] {
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

  toogleRoomIsLocked(roomName: RoomNames): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room) room.toggleIsLocked();
    this.onGameStateChange();
  }

  leaveRoom(roomName: RoomNames): boolean {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (room?.isLocked == false || room?.isLocked == undefined) {
      this.navigate('/game');
      this.onGameStateChange();
      return true;
    }
    return false;
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
    const room = allRoomStore.getRoomForDevice(name);
    if (device){
      device.complete();
      this.deviceListeners.forEach(cb => cb(device));

      if (this.getRoom(room).devices.filter(d => !d.getIsCompleted()).map(d => d.name).length <= 0){
        this.completeRoom(room);
      }
      this.onGameStateChange();
    }
  }

  getRoom(name: RoomNames): Room {
    return allRoomStore.getRoom(name);
  }

  subscribeExitStates(cb: () => void): () => void {
    this.exitStateListeners.add(cb);
    return () => this.exitStateListeners.delete(cb);
  }

  getExitState(from: MapKey, to: MapKey): DoorState {
    const f = roomNameToEnum(from);
    const t = roomNameToEnum(to);
    const fromRoom = this.getRoom( f ?? RoomNames.LIVINGROOM );
    const toRoom = this.getRoom(t ?? RoomNames.LIVINGROOM);

    if (fromRoom.isLocked || toRoom.isLocked){
      return DoorState.Closed;
    }else if (toRoom.isCompleted){
      return DoorState.Open;
    }else{
      return DoorState.HalfOpen;
    }
  }

  getDeviceByName(name : string){
    return  allRoomStore.getAllDevices().find(c => c.name == name) ?? new SmartDevice("DEFAULT")
  }

  getGame(){
    return this.game;
  }

  onDeviceStateChanged(listener: DeviceListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }
}
import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {RoomNames, roomNameToEnum} from "../objects/RoomNames";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore";
import {CookieService} from "@/services/CookieService";
import {allRoomStore} from "@/utils/roomStore";
import {movementStore} from "@/utils/character/movementEnabled";
import {tutorialDoneStore} from "@/hooks/gameService/useTutorialActive";
import {t} from "@lingui/core/macro";
import {MapKey} from "@/types/maps";
import {DoorState} from "@/types/door";
import {characterPositionStore} from "@/utils/character/characterPosition";
import {Direction, Position} from "@/types/movement";


type DeviceListener = (device: SmartDevice) => void;
type Listener = (paused: boolean) => void;

export class GameService {
  private game: Game;
  private navigate: (path: string) => void;
  private paused: boolean = false;
  private pauseListeners = new Set<Listener>();
  private smartDevicesEnabled = true;
  private smartDevicesEnabledListeners = new Set<Listener>();
  private deviceListeners = new Set<DeviceListener>();
  private exitStateListeners = new Set<() => void>();

  constructor(navigate: (path: string) => void) {
    const saveGame: Game | null = CookieService.get<Game>('save_game');
    const tutorialCookie: boolean | null = CookieService.get<boolean>('tutorialState');
    const characterPositionCookie: Position | null = CookieService.get<Position>('save_player_position');
    const characterFacingCookie: Direction | null = CookieService.get<Direction>('save_player_facing');

    if (saveGame) {
      const game = Game.fromSerialized(saveGame);
      this.game = game;
      allRoomStore.set(game.getRooms());

      if (characterPositionCookie != null) {
        characterPositionStore.set(characterPositionCookie);
      }else{
        characterPositionStore.reset();
      }

      if (characterFacingCookie != null){
        characterPositionStore.setFacing(characterFacingCookie);
      }

    } else {
      const newRooms = this.setUpRooms();
      this.game = new Game(newRooms);
      if (allRoomStore.getAll().length === 0) allRoomStore.set(newRooms);
      CookieService.set("save_player_position", null);
      CookieService.set("save_player_facing", null);
      characterPositionStore.reset()
      allRoomStore.reset()
    }

    if (tutorialCookie != null) {
      tutorialDoneStore.set(tutorialCookie);
    }


    this.navigate = navigate;
  }

  onGameStateChange(): void {
    CookieService.set("save_game", {
      rooms: allRoomStore.getAll().map(r => r.toSerialized()),
      score: this.game.getScore().toSerialized(),
    });
  }

  setUpRooms(): Room[] {

    const hallway = new Room(RoomNames.HALLWAY, []);
    hallway.complete();
    hallway.unlockRoom();

    const livingRoom = new Room(RoomNames.LIVINGROOM, [
      new SmartDevice("SmartTv", t`This is about trying to only give permission where necessary, whilst not disabling too much such that basic functionality is not available anymore. Uncheck the permissions which you think are not necessary by clicking directly on the checkbox.`),
      new SmartDevice("SmartLights", t`This is about trying to only give permission where necessary, whilst not disabling too much such that basic functionality is not available anymore. Modify your settings by clicking on the sliders. When you are satisfied with your choices continue by pressing the continue button`)
    ]);

    const kitchen = new Room(RoomNames.KITCHEN, [
      new SmartDevice("SmartHomeHub", t`Did you know personal data of members of the European Union are protected by the General Data Protection Regulation GDPR? The GDPR protects your personal information by law, and you may request its protection even if the data processor is not located in the EU. The GDPR even grants higher protection to especially sensitive data, that means data which might be abused against you are sorted into special categories. For example, this could be private information on your religion, or political views. Have you understood what the GDPR protects? Decide if provided information is public, personal, or personal and sensitive by dragging and dropping.`),
      new SmartDevice("SmartKitchen", t`You need to cook a meal. lets try to focus on privacy friendly but still practical choices. The minigame will let you know what the next steps are to complet the game.`),
      new SmartDevice("SecurityCamera", t`Let's first set the privacy settings by untoggeling the unnecessary permissions. Then we need to choose which camera placenemts are ok. Keep in mind your privacy and the privacy rights of others, that might be in the security camera frame. Places that are more private and intimat should probably not have a security camera pointing at them.`),
    ]);

    const bathroom = new Room(RoomNames.BATHROOM, [
      new SmartDevice("SmartShower", t`Configure your smart shower by clicking on objects and deciding which permissions to grant or services to enable.`),
    ]);

    const bedroom = new Room(RoomNames.BEDROOM, [
      new SmartDevice("SmartMirror", t`You need to configure your smart mirror by choosing a provider for each app. Compare the permissions, features, data retention, and security details of each provider. Expand each provider to see all the details, then make your choice. Remember to explore all providers for each app before making your selection.`),
    ]);

    return [hallway, livingRoom, kitchen, bathroom, bedroom];
  }

  getAllRooms(): Room[] {
    return allRoomStore.getAll();
  }

  private findRoomByName(roomName: RoomNames): Room | undefined {
    return allRoomStore.getRoom(roomName);
  }

  completeRoom(roomName: RoomNames): void {
    const room: Room | undefined = this.findRoomByName(roomName);
    if (!room) return;
    room.complete();
    this.getRoom(roomName).unlockRoom();
    if (this.checkGameCompletionConditions()) {
      this.finishGame();
    }
    this.onGameStateChange();
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
    if (movementStore.getSnapshot().movementEnabled) {
      movementStore.disable();
    }
    this.emitPause();
  }

  resumeGame(): void {
    this.paused = false;
    if (!movementStore.getSnapshot().movementEnabled) {
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

  getScore(): GameScore {
    return this.game.getScore();
  }

  completeDevice(name: string): void {
    const device = allRoomStore.getDevice(name);
    const room = allRoomStore.getRoomForDevice(name);
    if (device) {
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
    const fromRoomName = roomNameToEnum(from) ?? RoomNames.LIVINGROOM;
    const toRoomName = roomNameToEnum(to) ?? RoomNames.LIVINGROOM;

    const fromRoom = this.findRoomByName(fromRoomName);
    const toRoom = this.findRoomByName(toRoomName);

    if (!fromRoom || !toRoom){
      return DoorState.Closed
    }

    if (fromRoom.isLocked || toRoom.isLocked){
      return DoorState.Closed;
    }else if (toRoom.isCompleted){
      return DoorState.Open;
    }else{
      return DoorState.HalfOpen;
    }
  }

  checkRoomCompleted(name: RoomNames): boolean{
    return allRoomStore.getRoom(name).devices.every(d => d.getIsCompleted());
  }

  onDeviceStateChanged(listener: DeviceListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }

  public getGame(): Game {
    return this.game;
  }

  getDeviceByName(name : string){
    return  allRoomStore.getAllDevices().find(c => c.name == name) ?? new SmartDevice("DEFAULT")
  }
}
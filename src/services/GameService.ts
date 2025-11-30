import { Game } from "../objects/Game";
import { Room } from "../objects/Room";
import { RoomNames, roomNameToEnum } from "../objects/RoomNames";
import { SmartDevice } from "../objects/SmartDevice";
import { GameScore, ScoreType } from "@/objects/GameScore";
import { CookieService } from "@/services/CookieService";
import { movementStore } from "@/utils/character/movementEnabled";
import { tutorialDoneStore } from "@/hooks/gameService/useTutorialActive";
import { t } from "@lingui/core/macro";
import { MapKey } from "@/types/maps";
import { DoorState } from "@/types/door";
import { DeviceNames } from "@/objects/DeviceNames";
import { characterPositionStore } from "@/utils/character/characterPosition";
import { Direction, Position } from "@/types/movement";


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
      this.game = Game.fromSerialized(saveGame);

      if (characterPositionCookie != null) {
        characterPositionStore.set(characterPositionCookie);
      } else {
        characterPositionStore.reset();
      }

      if (characterFacingCookie != null) {
        characterPositionStore.setFacing(characterFacingCookie);
      }

    } else {
      const newRooms = this.setUpRooms();
      this.game = new Game(newRooms);
      CookieService.set("save_player_position", null);
      CookieService.set("save_player_facing", null);
      characterPositionStore.reset()
    }

    if (tutorialCookie != null) {
      tutorialDoneStore.set(tutorialCookie);
    }


    this.navigate = navigate;
  }

  onGameStateChange(): void {
    CookieService.set("save_game", {
      rooms: this.game.getRooms().map(r => r.toSerialized()),
      score: this.game.getScore().toSerialized(),
    });
  }

  setUpRooms(): Room[] {

    const hallway = new Room(RoomNames.HALLWAY, []);
    hallway.complete();
    hallway.unlockRoom();

    const livingRoom = new Room(RoomNames.LIVINGROOM, [
      new SmartDevice(DeviceNames.SMART_TV, t`This is about giving permission only where necessary, without disabling so much that basic functionality is no longer available. Uncheck the permissions you think are not necessary by clicking the checkbox directly.`),
      new SmartDevice(DeviceNames.SMART_LIGHTS, t`This is about giving permission only where necessary, without turning off so much that basic functionality stops working. Modify your settings by clicking the sliders. When you’re satisfied with your choices, press the 'Continue' button.`)
    ]);

    const kitchen = new Room(RoomNames.KITCHEN, [
      new SmartDevice(DeviceNames.SMART_HOME_HUB, t`Did you know that personal data processed within the European Union is protected by the General Data Protection Regulation (GDPR)? The GDPR protects your personal information by law, and you may request its protection even if the data processor is not located in the EU. The GDPR also grants enhanced protection to particularly sensitive data, meaning data which might be abused against you is sorted into special categories. For example, this could be private information about your religion or political views. Have you understood what the GDPR protects? Decide whether provided information is public, personal, or personal and sensitive by dragging and dropping.`),
      new SmartDevice(DeviceNames.SMART_KITCHEN, t`Your task is to cook a meal. Let’s try to focus on privacy-friendly yet practical choices. The minigame will show you the next steps you need to take to complete the game.`),
      new SmartDevice(DeviceNames.SECURITY_CAMERA, t`Let’s first adjust our privacy settings by untoggling unnecessary permissions. Then, we need to choose which camera placements are acceptable. Check whether the camera angles compromise your privacy or the privacy of others. Your Smart Camera might be activated in spaces where you would otherwise not want video or photo recording.`),
    ]);

    const bathroom = new Room(RoomNames.BATHROOM, [
      new SmartDevice(DeviceNames.SMART_SHOWER, t`Configure your smart shower by clicking on objects and choosing which permissions to grant or which services to enable.`),
    ]);

    const bedroom = new Room(RoomNames.BEDROOM, [
      new SmartDevice(DeviceNames.SMART_MIRROR, t`Your task is to configure your Smart Mirror by choosing a provider for each app. Compare each provider’s permissions, features, data-retention and security details. Expand a provider to view the full details, then make your selection. Be sure to review all providers for every app before deciding.`),
    ]);

    return [hallway, livingRoom, kitchen, bathroom, bedroom];
  }

  getAllRooms(): Room[] {
    return this.game.getRooms();
  }

  private findRoomByName(roomName: RoomNames): Room | undefined {
    return this.game.getRooms().find(r => r.name === roomName);
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
    return this.game.getRooms().every((room: Room) => room.isCompleted);
  }

  getDeviceForRoom(roomName: RoomNames): SmartDevice[] {
    const room: Room | undefined = this.findRoomByName(roomName);
    return room ? room.devices : [];
  }

  reset(): boolean {
    const newRooms = this.setUpRooms();
    this.game = new Game(newRooms);
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

  //ToDo Depreacated remove later #189
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
    return this.game.calculateScore();
  }

  completeDevice(name: DeviceNames): void {
    const device = this.getDeviceByName(name);
    const room = this.getRoomForDevice(name);
    if (device && room) {
      device.complete();
      this.deviceListeners.forEach(cb => cb(device));
      if (this.getRoom(room.name).devices.filter(d => !d.getIsCompleted()).map(d => d.name).length <= 0) {
        this.completeRoom(room.name);
      }
      this.onGameStateChange();
    }
  }

  getRoom(name: RoomNames): Room {
    const room = this.game.getRooms().find(r => r.name === name);
    if (!room) throw new Error(`Room ${name} not found`);
    return room;
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

    if (!fromRoom || !toRoom) {
      return DoorState.Closed
    }

    if (fromRoom.isLocked || toRoom.isLocked) {
      return DoorState.Closed;
    } else if (toRoom.isCompleted) {
      return DoorState.Open;
    } else {
      return DoorState.HalfOpen;
    }
  }

  onDeviceStateChanged(listener: DeviceListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }

  public getGame(): Game {
    return this.game;
  }

  getDeviceByName(name: DeviceNames): SmartDevice {
    const device = this.game.getRooms()
      .flatMap(room => room.devices).find(c => c.name == name);
    if (!device) {
      throw new Error(`Device with name ${name} not found`);
    }
    return device;
  }

  getRoomForDevice(name: DeviceNames): Room | undefined {
    return this.game.getRooms().find(r => r.devices.some(d => d.name === name));
  }
}
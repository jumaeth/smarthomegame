import {Game} from "../objects/Game";
import {Room, RoomName} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {GameScore, ScoreType} from "@/objects/GameScore.ts";
import {CookieService} from "@/services/CookieService.ts";
import {allRoomStore} from "@/utils/roomStore.ts";
import {movementStore} from "@/utils/movementEnabled.ts";
import {t} from "@lingui/core/macro";
import {tutorialActiveStore} from "@/hooks/gameService/useTutorialActive.ts";


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

  constructor(navigate: (path: string) => void) {
    const saveGame = CookieService.get<Game>('save_game');
    const tutorialCookie = CookieService.get<boolean>('tutorialState');
    if (saveGame) {
      const game = Game.fromSerialized(saveGame);
      this.game = game;
      allRoomStore.set(game.getRooms());
      if (tutorialCookie != null) tutorialActiveStore.set(tutorialCookie);
    } else {
      const newRooms = this.setUpRooms();
      this.game = new Game(newRooms);
      if (allRoomStore.getAll().length === 0) allRoomStore.set(newRooms);
    }
    this.navigate = navigate;
  }

  onGameStateChange(): void {
    CookieService.set("save_game", {
      rooms: allRoomStore.getAll().map(r => r.toSerialized()),
      score: this.game.getScore().toSerialized(),
    });
    CookieService.set("tutorialState", tutorialActiveStore.get());
  }

  setUpRooms(): Room[] {

    const livingRoom = new Room("livingroom", [
      new SmartDevice("SmartTv", t`This is about trying to only give permission where necessary, whilst not disabling too much such that basic functionality is not available anymore. Uncheck the permissions which you think are not necessary by clicking directly on the checkbox.`),
      new SmartDevice("SmartLights", t`This is about trying to only give permission where necessary, whilst not disabling too much such that basic functionality is not available anymore. Modify your settings by clicking on the sliders. When you are satisfied with your choices continue by pressing the continue button`)
    ]);

    const kitchen = new Room("kitchen", [
      new SmartDevice("SmartHomeHub", t`Did you know personal data of members of the European Union are protected by the General Data Protection Regulation GDPR? The GDPR protects your personal information by law, and you may request its protection even if the data processor is not located in the EU. The GDPR even grants higher protection to especially sensitive data, that means data which might be abused against you are sorted into special categories. For example, this could be private information on your religion, or political views. Have you understood what the GDPR protects? Decide if provided information is public, personal, or personal and sensitive by dragging and dropping.`),
      new SmartDevice("SmartKitchen", t`You need to cook a meal. lets try to focus on privacy friendly but still practical choices. The minigame will let you know what the next steps are to complet the game.`),
      new SmartDevice("SecurityCamera", t`Let's first set the privacy settings by untoggeling the unnecessary permissions. Then we need to choose which camera placenemts are ok. Keep in mind your privacy and the privacy rights of others, that might be in the security camera frame. Places that are more private and intimat should probably not have a security camera pointing at them.`),
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
    const room: Room = this.findRoomByName(roomName)!;
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
      if (this.checkRoomCompleted(room)) this.completeRoom(room);
      this.onGameStateChange();
    }
  }

  checkRoomCompleted(name: RoomName): boolean {
    return allRoomStore.getRoom(name).devices.every(d => d.getIsCompleted());
  }

  onDeviceStateChanged(listener: DeviceListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }
}
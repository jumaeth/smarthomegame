import {GameService} from '../GameService';
import {Room} from "@/objects/Room";
import {SmartDevice} from "@/objects/SmartDevice";
import {CookieService} from '@/services/CookieService';
import {movementStore} from '@/utils/movementEnabled';
import {RoomNames} from "@/objects/RoomNames.ts";

// mock CookieService to avoid document access
jest.mock('@/services/CookieService', () => ({
  CookieService: {
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('GameService', () => {
  let navigateMock: jest.Mock;
  let gameService: GameService;

  beforeEach(() => {
    const rooms = [
      new Room(RoomNames.LIVINGROOM, [
        new SmartDevice("SmartTv"),
        new SmartDevice("SmartLights"),
      ]),
    ];

    navigateMock = jest.fn();

    // Mock `setUpRooms` vor der Instanziierung von `GameService`
    jest.spyOn(GameService.prototype, 'setUpRooms').mockReturnValue(rooms);

    gameService = new GameService(navigateMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('onGameStateChange() should save the game object to the cookies', () => {
    gameService.onGameStateChange();
    expect(CookieService.set).toHaveBeenCalledWith(
            "save_game", {"rooms": [{"devices": [{"isCompleted": false, "name": "SmartTv"}, {"isCompleted": false, "name": "SmartLights"}], "isCompleted": false, "isLocked": false, "name": "livingroom"}], "score": {"comfort": 50, "privacy": 0}}
    );
  });

  it('getAllRooms() should return all rooms', () => {
    const result = gameService.getAllRooms();
    expect(result).toEqual([
      new Room(RoomNames.LIVINGROOM, [
        new SmartDevice('SmartTv'),
        new SmartDevice('SmartLights'),
      ]),
    ]);
  });

  it('completeRoom() should set selected room to complete', () => {
    gameService.completeRoom(RoomNames.LIVINGROOM);
    expect(gameService.getAllRooms()?.[0].isCompleted).toBe(true);
  });

  it('completeRoom() should call continue game when not all rooms are completed', () => {
    const continueGameSpy = jest.spyOn(gameService, 'continueGame');
    const checkGameCompletionSpy = jest
            .spyOn(gameService, 'checkGameCompletionConditions')
            .mockReturnValue(false);

    gameService.completeRoom(RoomNames.LIVINGROOM);

    expect(continueGameSpy).toHaveBeenCalled();
    expect(checkGameCompletionSpy).toHaveBeenCalled();

    continueGameSpy.mockRestore();
    checkGameCompletionSpy.mockRestore();
  });

  it('completeRoom() should call finish game when all rooms are completed', () => {
    const finishGameSpy = jest.spyOn(gameService, 'finishGame');
    const checkGameCompletionSpy = jest
            .spyOn(gameService, 'checkGameCompletionConditions')
            .mockReturnValue(true);

    gameService.completeRoom(RoomNames.LIVINGROOM);

    expect(finishGameSpy).toHaveBeenCalled();
    expect(checkGameCompletionSpy).toHaveBeenCalled();

    finishGameSpy.mockRestore();
    checkGameCompletionSpy.mockRestore();
  });

  it('getDeviceForRoom() should return the devices for a given room', () => {
    const devices = gameService.getDeviceForRoom(RoomNames.LIVINGROOM);
    expect(devices).toBeDefined();
    expect(devices.length).toBeGreaterThan(0);
    expect(devices[0].name).toBeDefined();
  });

  it('reset() should clean up the game service and return to the main page', () => {
    gameService.reset();
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(gameService.getAllRooms()).toBeDefined();
  });

  it('finishGame() should navigate to the victory page', () => {
    gameService.finishGame();
    expect(navigateMock).toHaveBeenCalledWith('/game/game-over');
  });

  it('continueGame() should navigate to the main map page', () => {
    gameService.continueGame();
    expect(navigateMock).toHaveBeenCalledWith('/game');
  });

  it('pauseGame() should set paused to true and disable movement', () => {
    const disableSpy = jest.spyOn(movementStore, 'disable').mockImplementation();
    jest.spyOn(movementStore, 'getSnapshot').mockReturnValue({ movementEnabled: true });

    gameService.pauseGame();

    expect(gameService.isPaused()).toBe(true);
    expect(disableSpy).toHaveBeenCalled();

    disableSpy.mockRestore();
  });

  it('resumeGame() should set paused to false and enable movement', () => {
    const enableSpy = jest.spyOn(movementStore, 'enable').mockImplementation();
    jest.spyOn(movementStore, 'getSnapshot').mockReturnValue({ movementEnabled: false });

    gameService.resumeGame();

    expect(gameService.isPaused()).toBe(false);
    expect(enableSpy).toHaveBeenCalled();

    enableSpy.mockRestore();
  });

  it('disableSmartDevices() should set smartDevicesEnabled to false', () => {
    gameService.disableSmartDevices();
    expect(gameService.areSmartDevicesEnabled()).toBe(false);
  });

  it('enableSmartDevices() should set smartDevicesEnabled to true', () => {
    gameService.disableSmartDevices();
    gameService.enableSmartDevices();
    expect(gameService.areSmartDevicesEnabled()).toBe(true);
  });

  it('leaveRoom() should navigate if room is not locked', () => {
    const result = gameService.leaveRoom(RoomNames.LIVINGROOM);
    expect(result).toBe(true);
    expect(navigateMock).toHaveBeenCalledWith('/game');
  });

  it('changeScore() should modify privacy score', () => {
    const spy = jest.spyOn(gameService.getScore(), 'toSerialized');
    gameService.changeScore(10, 'privacy');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('changeScore() should modify comfort score', () => {
    const spy = jest.spyOn(gameService.getScore(), 'toSerialized');
    gameService.changeScore(5, 'comfort');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('isPaused() should return paused state', () => {
    gameService.pauseGame();
    expect(gameService.isPaused()).toBe(true);
    gameService.resumeGame();
    expect(gameService.isPaused()).toBe(false);
  });

  it('areSmartDevicesEnabled() should return smart devices state', () => {
    gameService.disableSmartDevices();
    expect(gameService.areSmartDevicesEnabled()).toBe(false);
    gameService.enableSmartDevices();
    expect(gameService.areSmartDevicesEnabled()).toBe(true);
  });

  it('subscribePause() should call listener with current paused state and allow unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = gameService.subscribePause(listener);
    expect(listener).toHaveBeenCalledWith(false);
    unsubscribe();
    gameService.pauseGame();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('subscribeSmartDevicesEnabled() should call listener with current state and allow unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = gameService.subscribeSmartDevicesEnabled(listener);
    expect(listener).toHaveBeenCalledWith(true);
    unsubscribe();
    gameService.disableSmartDevices();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('completeDevice() should mark device complete and trigger deviceListeners', () => {
    const device = gameService.getDeviceForRoom(RoomNames.LIVINGROOM)[0];
    const listener = jest.fn();
    gameService.onDeviceStateChanged(listener);
    gameService.completeDevice(device.name);

    interface SerializedDevice {
      name: string;
      isCompleted: boolean;
    }
    const serialized = device.toSerialized() as unknown as SerializedDevice;
    expect(serialized.isCompleted).toBe(true);
    expect(listener).toHaveBeenCalledWith(device);
  });

});

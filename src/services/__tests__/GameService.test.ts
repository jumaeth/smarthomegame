import {GameService} from '../GameService';
import {Room} from "@/objects/Room";
import {SmartDevice} from "@/objects/SmartDevice";

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
      new Room("livingroom", [
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

  it('finishGame() should navigate to the victory page', () => {
    gameService.finishGame();
    expect(navigateMock).toHaveBeenCalledWith('/game/game-over');
  });

  it('continueGame() should navigate to the main map page', () => {
    gameService.continueGame();
    expect(navigateMock).toHaveBeenCalledWith('/game');
  });

  it('reset() should clean up the game service and return to the main page', () => {
    gameService.reset();
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(gameService.getAllRooms()).toBeDefined();
  });

  it('getDeviceForRoom() should return the devices for a given room', () => {
    const devices = gameService.getDeviceForRoom('livingroom');
    expect(devices).toBeDefined();
    expect(devices.length).toBeGreaterThan(0);
    expect(devices[0].name).toBeDefined();
  });

  it('checkGameCompletionConditions() should return true if all rooms are completed', () => {
    expect(gameService.checkGameCompletionConditions()).toBe(false);

    const rooms = gameService.getAllRooms();
    rooms?.forEach((room) => (room.isCompleted = true));

    expect(gameService.checkGameCompletionConditions()).toBe(true);
  });

  it('completeRoom() should set selected room to complete', () => {
    gameService.completeRoom('livingroom');
    expect(gameService.getAllRooms()?.[0].isCompleted).toBe(true);
  });

  it('completeRoom() should call continue game when not all rooms are completed', () => {
    const continueGameSpy = jest.spyOn(gameService, 'continueGame');
    const checkGameCompletionSpy = jest
            .spyOn(gameService, 'checkGameCompletionConditions')
            .mockReturnValue(false);

    gameService.completeRoom('livingroom');

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

    gameService.completeRoom('livingroom');

    expect(finishGameSpy).toHaveBeenCalled();
    expect(checkGameCompletionSpy).toHaveBeenCalled();

    finishGameSpy.mockRestore();
    checkGameCompletionSpy.mockRestore();
  });
});

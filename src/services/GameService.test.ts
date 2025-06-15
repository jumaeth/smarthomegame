import {GameService} from './GameService';
import {Room} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";


describe('GameService', () => {
  let navigateMock: jest.Mock;
  let gameService: GameService;

  beforeEach(() => {
    const rooms = [
      new Room("Living Room", "/game/living-room", "LivingRoomComponent", [
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
  })

  it('continueGame() should navigate to the main map page', () => {
    gameService.continueGame();
    expect(navigateMock).toHaveBeenCalledWith('/game');
  })

  it('reset() should clean up the game service and return to the main page', () => {
    gameService.reset();
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(gameService.getRooms()).toBeUndefined();
  });

  it('getDeviceForRoom() should return the devices for a given room', () => {
    const devices = gameService.getDeviceForRoom('Living Room');
    expect(devices).toBeDefined();
    expect(devices.length).toBeGreaterThan(0);
    expect(devices[0].name).toBeDefined();
  })

  it('checkGameCompletionConditions() should return true if all rooms are completed', () => {
    expect(gameService.checkGameCompletionConditions()).toBe(false);


    const rooms = gameService.getRooms();
    rooms?.forEach((room) => room.isCompleted = true);

    expect(gameService.checkGameCompletionConditions()).toBe(true);
  })

  it('completeRoom() should set selected room to complete', () => {
    gameService.completeRoom('Living Room');

    expect(gameService.getRooms()?.[0].isCompleted).toBe(true);
  });

  it('completeRoom() should call continue game when not all rooms are completed', () => {
    const continueGameSpy = jest.spyOn(gameService, 'continueGame');
    const checkGameCompletionSpy = jest.spyOn(gameService, 'checkGameCompletionConditions').mockReturnValue(false);

    gameService.completeRoom('Living Room');

    expect(continueGameSpy).toHaveBeenCalled();
    expect(checkGameCompletionSpy).toHaveBeenCalled();

    continueGameSpy.mockRestore();
    checkGameCompletionSpy.mockRestore();
  });

  it('completeRoom() should call continue game when not all rooms are completed', () => {
    const finishGameSpy = jest.spyOn(gameService, 'finishGame');
    const checkGameCompletionSpy = jest.spyOn(gameService, 'checkGameCompletionConditions').mockReturnValue(true);

    gameService.completeRoom('Living Room');

    expect(finishGameSpy).toHaveBeenCalled();
    expect(checkGameCompletionSpy).toHaveBeenCalled();

    finishGameSpy.mockRestore();
    checkGameCompletionSpy.mockRestore();
  });


});
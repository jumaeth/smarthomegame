import {Game} from "../objects/Game.ts";
import {Room} from "../objects/Room.ts";
import {SmartDevice} from "../objects/SmartDevice.ts";

export class GameService {
    private game: Game | null;
    private navigate: (path: string) => void;

    constructor(navigate: (path: string) => void) {
        const rooms = [
            new Room("Living Room", "/game/living-room", "LivingRoomComponent", [
                new SmartDevice("SmartTv"),
                new SmartDevice("SmartLights"),
            ]),
        ];

        this.game = new Game(rooms);
        this.navigate = navigate;
        console.log(this.game);
    }

    completeRoom(roomName: string) {
        if (!this.game) return;

        const room = this.game.rooms.find((r) => r.name === roomName);
        if (room) {
            room.completed = true;
            if (this.checkGameCompletionConditions()) {
                this.finishGame();
            } else {
                this.continueGame();
            }
        }
    }

    checkGameCompletionConditions(): boolean {
        if (!this.game) {
            return false
        }
        return this.game.rooms.every((room) => room.completed);
    }

    getDeviceForRoom(roomName: string) {
        if (!this.game) {
            return [];
        }
        const room = this.game.rooms.find((room) => room.name === roomName);
        return room ? room.devices : [];
    }

    reset(): boolean {
        // Reset game logic here
        this.game = null;
        this.navigate('/');
        return true;
    }

    finishGame() {
        this.navigate('/game/game-over');

    }

    continueGame() {
        this.navigate('/game');
    }

    getRooms() {
        return this.game?.rooms
    }
}
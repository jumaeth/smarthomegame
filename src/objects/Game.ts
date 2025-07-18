import {Room} from "./Room";
import {GameScore} from "./GameScore.ts"

export class Game {
  private readonly rooms: Room[];
  private score: GameScore;

  constructor(rooms: Room[], score?: GameScore) {
    this.rooms = rooms;
    this.score = score ? score : new GameScore(0, 50)
  }

  static fromSerialized(data: Game): Game {
    const rooms = data.rooms.map((roomData: Room) => Room.fromSerialized(roomData));
    const score = GameScore.fromSerialized(data.score);
    return new Game(rooms, score);
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getScore(): GameScore {
    return this.score;
  }

  modifyScore(privacyScoreDelta: number, comfortScoreDelta: number): void {
    this.score.setPrivacyScore(privacyScoreDelta + this.score.getPrivacyScore());
    this.score.setComfortScore(comfortScoreDelta + this.score.getComfortScore());
  }

}

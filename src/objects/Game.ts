import {Room} from "./Room";
import {GameScore} from "./GameScore.ts"

export class Game {
  private readonly rooms: Room[];
  private score: GameScore;

  constructor(rooms: Room[],) {
    this.rooms = rooms;
    this.score = new GameScore(0, 50)
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

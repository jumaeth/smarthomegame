import {Room} from "./Room";
import {GameScore} from "./GameScore"

export class Game {
  private readonly rooms: Room[];
  //Deprecated, use calculateScore instead ToDo Remove in #189
  private readonly score: GameScore;

  constructor(rooms: Room[], score?: GameScore) {
    this.rooms = rooms;
    this.score = score ? score : new GameScore(10, 10, 1)
  }

  static fromSerialized(data: Game): Game {
    const rooms = data.rooms.map((roomData: Room) => Room.fromSerialized(roomData));
    const score = GameScore.fromSerialized(data.score);
    return new Game(rooms, score);
  }

  toSerialized(): object {
    return {
      rooms: this.rooms.map((room: Room) => room.toSerialized()),
      score: this.score.toSerialized()
    };
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getScore(): GameScore {
    return this.score;
  }

  //Deprecated, use calculateScore instead ToDo Remove in #189
  modifyScore(privacyScoreDelta: number, comfortScoreDelta: number): void {
    this.score.setPrivacyScore(privacyScoreDelta + this.score.getPrivacyScore());
    this.score.setComfortScore(comfortScoreDelta + this.score.getComfortScore());
  }

  calculateScore():GameScore{
    const individualSmartDeviceScores: GameScore[]= this.rooms
            .flatMap(room => room.devices)
            .map(device => device.getScore());

    return individualSmartDeviceScores.reduce((accumulator: GameScore, currentScore:GameScore) => {
      accumulator.setPrivacyScore(accumulator.getPrivacyScore() + currentScore.getPrivacyScore()*currentScore.getPointsWeight());
      accumulator.setComfortScore(accumulator.getComfortScore() + currentScore.getComfortScore()*currentScore.getPointsWeight());
      return accumulator;
    }, new GameScore(0, 0, 1));

  }
}
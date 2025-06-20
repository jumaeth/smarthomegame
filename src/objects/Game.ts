import {Room} from "./Room";

export class Game {
  private readonly rooms: Room[];
  private privacyScore: number;
  private comfortScore: number;

  constructor(rooms: Room[],) {
    this.rooms = rooms;
    this.privacyScore = 0
    this.comfortScore = 50
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getPrivacyScore(): number {
    return this.privacyScore;
  }

  setPrivacyScore(newScore: number): void {
    this.privacyScore = newScore;
  }

  getComfortScore(): number {
    return this.comfortScore;
  }

  setComfortScore(newScore: number): void {
    this.comfortScore = newScore;
  }

}
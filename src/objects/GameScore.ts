import {PointsLevel} from "@/objects/PointsLevel";

export class GameScore {
  private privacyScore: number = 0;
  private comfortScore: number = 0;

  constructor(privacyScore: number, comfortScore: number) {
    this.privacyScore = privacyScore;
    this.comfortScore = comfortScore;
  }

  static fromSerialized(data: GameScore): GameScore {
    return new GameScore(data.privacyScore, data.comfortScore);
  }

  toSerialized(): object {
    return {
      privacyScore: this.privacyScore,
      comfortScore: this.comfortScore
    };
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

  public getPrivacyLevel(): PointsLevel| undefined {
    return PointsLevel.fromValue(this.privacyScore);
  }

  public getComfortLevel(): PointsLevel | undefined {
    return PointsLevel.fromValue(this.comfortScore);
  }
}

export type ScoreType = 'privacy' | 'comfort';
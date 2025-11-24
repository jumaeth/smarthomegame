import {PointsLevel} from "@/objects/PointsLevel";

export class GameScore {
  private privacyScore: number = 0;
  private comfortScore: number = 0;
  private readonly weight: number;

  constructor(privacyScore: number, comfortScore: number, weight: number) {
    this.privacyScore = privacyScore;
    this.comfortScore = comfortScore;
    this.weight = weight;
  }

  static fromSerialized(data: GameScore): GameScore {
    return new GameScore(data.privacyScore, data.comfortScore, data.getPointsWeight());
  }

  toSerialized(): object {
    return {
      privacyScore: this.privacyScore,
      comfortScore: this.comfortScore,
      weight: this.weight
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

  public getPointsWeight(): number {
    return this.weight;
  }
}

export type ScoreType = 'privacy' | 'comfort';
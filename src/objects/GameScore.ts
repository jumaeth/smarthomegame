export class GameScore {
  private privacyScore: number;
  private comfortScore: number;

  constructor(privacyScore: number, comfortScore: number) {
    this.privacyScore = privacyScore;
    this.comfortScore = comfortScore;
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

export type ScoreType = 'privacy' | 'comfort';
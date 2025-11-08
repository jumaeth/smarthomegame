// typescript
export class PointsLevel {
  private constructor(
          public readonly name: 'LOW' | 'MEDIUM' | 'HIGH',
          public readonly min: number,
          public readonly max: number
  ) {}

  static readonly LOW = new PointsLevel('LOW', 0, 40);
  static readonly MEDIUM = new PointsLevel('MEDIUM', 40, 80);
  static readonly HIGH = new PointsLevel('HIGH', 80, 100);

  static values(): PointsLevel[] {
    return [PointsLevel.LOW, PointsLevel.MEDIUM, PointsLevel.HIGH];
  }

  contains(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  static fromValue(value: number): PointsLevel | undefined {
    if(value < 0 ) {
      return this.LOW
    }else if (value > 100) {
      return this.HIGH
    }
    return PointsLevel.values().find(p => p.contains(value));
  }

  toString(): string {
    return `${this.name} (${this.min}-${this.max})`;
  }
}
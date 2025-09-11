import {StatsKeys} from "./StatsKeys";

export class StatBlock {
  private readonly values: Map<StatsKeys | string, string>;
  private startTimeTimestamp: number = 0;


  constructor() {
    this.values = new Map<StatsKeys | string, string>();
  }

  public findByName(name: StatsKeys | string): string {
    return this.values.get(name) ?? "";
  }

  public setValue(name: StatsKeys | string, value: string): void {
    this.values.set(name, value);
  }

  public getValuesReadOnly(): ReadonlyMap<StatsKeys | string, string> {
    return this.values;
  }

  public startTimer(): void {
    this.startTimeTimestamp = Date.now();
    const amountOfSessions = Number(this.values.get(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS) ?? "0");
    this.values.set(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS, String(amountOfSessions + 1))
  }

  public stopTimer(): void {
    if (!this.startTimeTimestamp) {
      throw new Error("Timer was not started.");
    }
    const elapsed: number = Date.now() - this.startTimeTimestamp;
    const previousTime: number = Number(this.values.get(StatsKeys.TIME_IN_DEVICE)) ?? 0;
    this.values.set(StatsKeys.TIME_IN_DEVICE, String(previousTime + elapsed));
    this.startTimeTimestamp = 0;
  }


}
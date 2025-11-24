import {StatBlock} from "./StatBlock";
import {GameScore} from "@/objects/GameScore.ts";
import {DeviceNames, deviceNameToEnum} from "@/objects/DeviceNames.ts";
import {getPointsWeight} from "@/objects/DevicePointsWeight.ts";

type DeviceListener = (device: SmartDevice) => void;

export class SmartDevice {

  private listeners = new Set<DeviceListener>;
  private readonly score: GameScore


  constructor(
          public name: DeviceNames,
          private helpText: string = "sorry, I cant help you with this",
          private isCompleted: boolean = false,
          public statBlock: StatBlock = new StatBlock(),
  ) {
    this.score = new GameScore(0, 0, getPointsWeight(name));
  }

  static fromSerialized(data: SmartDevice): SmartDevice {
    const sd = new SmartDevice(data.name, data.helpText);
    sd.isCompleted = data.isCompleted;
    return sd;
  }

  toSerialized(): object {
    return {
      name: this.name,
      helpText: this.helpText,
      isCompleted: this.isCompleted,
    };
  }

  complete(): void {
    this.isCompleted = true;
    this.emit();
  }

  getIsCompleted(): boolean {
    return this.isCompleted;
  }

  getHelpText(): string {
    return this.helpText;
  }

  subscribe(listener: DeviceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const l of this.listeners) l(this);
  }

  getStatBlock(): StatBlock {
    if (!this.statBlock) {
      return new StatBlock()
    }
    return this.statBlock;
  }

  modifyScore(privacyScoreDelta: number, comfortScoreDelta: number): void {
    this.score.setPrivacyScore(privacyScoreDelta + this.score.getPrivacyScore());
    this.score.setComfortScore(comfortScoreDelta + this.score.getComfortScore());
  }

  getScore(): GameScore{
    return this.score;
  }
}
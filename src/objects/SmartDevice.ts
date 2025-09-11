import {StatBlock} from "./StatBlock";

export class SmartDevice {
  constructor(
          public name: string,
          private isCompleted: boolean = false,
          public statBlock: StatBlock = new StatBlock()
  ) {
  }

  static fromSerialized(data: SmartDevice): SmartDevice {
    return new SmartDevice(data.name);
  }

  complete(): void {
    this.isCompleted = true;
  }

  getIsCompleted(): boolean {
    return this.isCompleted;
  }

  getStatBlock(): StatBlock {
    if (!this.statBlock) {
      return new StatBlock()
    }
    return this.statBlock;
  }
}
import {StatBlock} from "@/objects/StatBlock.ts";

export class SmartDevice {
  constructor(
          public name: string,
          private isCompleted: boolean = false,
          public statBlock?: StatBlock
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
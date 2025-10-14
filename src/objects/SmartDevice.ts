import {StatBlock} from "./StatBlock";

type DeviceListener = (device: SmartDevice) => void;
export class SmartDevice {

  private listeners = new Set<DeviceListener>;

  constructor(
          public name: string,
          private helpText:string,
          private isCompleted: boolean = false,
          public statBlock: StatBlock = new StatBlock()
  ) {
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

  getHelpText():string{
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
}
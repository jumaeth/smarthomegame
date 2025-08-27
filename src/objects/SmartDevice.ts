
type DeviceListener = (device: SmartDevice) => void;
export class SmartDevice {

  private listeners = new Set<DeviceListener>;

  constructor(
          public name: string,
          private isCompleted: boolean = false
  ) {
  }

  static fromSerialized(data: SmartDevice): SmartDevice {
    return new SmartDevice(data.name);
  }

  complete():void {
    this.isCompleted = true;
    this.emit();
  }

  getIsCompleted():boolean{
    return this.isCompleted;
  }

  subscribe(listener: DeviceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const l of this.listeners) l(this);
  }
}
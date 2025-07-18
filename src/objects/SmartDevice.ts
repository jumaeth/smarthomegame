export class SmartDevice {
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
  }

  getIsCompleted():boolean{
    return this.isCompleted;
  }
}
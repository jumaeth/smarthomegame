export class SmartDevice {
  constructor(
          public name: string,
          private isCompleted: boolean = false
  ) {
  }

  static fromSerialized(data: SmartDevice): SmartDevice {
    const sd = new SmartDevice(data.name);
    sd.isCompleted = data.isCompleted;
    return sd;
  }

  toSerialized(): object {
    return {
      name: this.name,
      isCompleted: this.isCompleted
    };
  }

  complete():void {
    this.isCompleted = true;
  }

  getIsCompleted():boolean{
    return this.isCompleted;
  }
}
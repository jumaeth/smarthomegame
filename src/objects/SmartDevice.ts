export class SmartDevice {
  constructor(
          public name: string,
          private isCompleted: boolean = false
  ) {
  }

  complete():void {
    this.isCompleted = true;
  }

  getIsCompleted():boolean{
    return this.isCompleted;
  }
}
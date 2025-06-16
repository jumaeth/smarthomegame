import {SmartDevice} from "./SmartDevice";

export class Room {
  constructor(
          public name: string,
          public url: string,
          public componentName: string,
          public devices: SmartDevice[],
          public isLocked: boolean = false,
          public isCompleted: boolean = false
  ) {
  }
}
import {SmartDevice} from "./SmartDevice.ts";

export class Room {
  constructor(
          public name: string,
          public url: string,
          public componentName: string,
          public devices: SmartDevice[],
          public completed: boolean = false
  ) {
  }
}
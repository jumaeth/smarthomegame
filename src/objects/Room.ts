import {SmartDevice} from "./SmartDevice";

export class Room {
  constructor(
          public name: RoomName,
          public devices: SmartDevice[],
          public isLocked: boolean = false,
          public isCompleted: boolean = false
  ) {
  }

  complete(): void {
    this.isCompleted = true;
  }

  toggleIsLocked(): void {
    this.isLocked = !this.isLocked;
  }
}

export type RoomName =
        | 'livingroom'
        | 'hallway'
        | 'kitchen'
        ;

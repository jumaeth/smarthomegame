import {SmartDevice} from "./SmartDevice";

export class Room {
  constructor(
          public name: RoomName,
          public devices: SmartDevice[],
          public isLocked: boolean = false,
          public isCompleted: boolean = false
  ) {
  }
}

export type RoomName =
        | 'livingRoom'
        | 'hallway'
        | 'kitchen'
        ;
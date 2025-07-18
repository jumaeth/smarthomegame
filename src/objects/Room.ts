import {SmartDevice} from "./SmartDevice";

export class Room {
  constructor(
          public name: RoomName,
          public devices: SmartDevice[],
          public isLocked: boolean = false,
          public isCompleted: boolean = false
  ) {
  }

  static fromSerialized(data: Room): Room {
    const devices = data.devices.map((d: SmartDevice) => SmartDevice.fromSerialized(d));
    const room = new Room(data.name, devices);
    room.isCompleted = data.isCompleted;
    room.isLocked = data.isLocked;
    return room;
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

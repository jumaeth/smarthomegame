import {SmartDevice} from "./SmartDevice";
import {RoomNames} from "./RoomNames";

export class Room {
  constructor(
          public name: RoomNames,
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

  toSerialized(): object {
    return {
      name: this.name,
      devices: this.devices.map((device: SmartDevice) => device.toSerialized()),
      isLocked: this.isLocked,
      isCompleted: this.isCompleted
    };
  }

  complete(): void {
    this.isCompleted = true;
  }

  toggleIsLocked(): void {
    this.isLocked = !this.isLocked;
  }
}
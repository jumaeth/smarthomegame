import {SmartDevice} from "@/objects/SmartDevice";
import {useMemo, useSyncExternalStore} from "react";
import {Room} from "@/objects/Room";
import {RoomNames} from "@/objects/RoomNames";
import {MapKey} from "@/types/maps.ts";

type Listener = () => void;

class roomStore {
  private rooms: Room[];
  private listeners = new Set<Listener>();
  constructor(initial: Room[]) {
    this.rooms = initial ? initial : [];
  }

  getAll(): Room[] {
    return this.rooms;
  }

  getRoom(name: string): Room {
    return <Room>this.rooms.find(r => r.name === name);
  }

  getAllDevices(): SmartDevice[] {
    return this.rooms.flatMap(r => r.devices);
  }

  getRoomForDevice(name: string): RoomNames {
    return <RoomNames>this.rooms.find(r => r.devices.find(d => d.name === name))?.name;
  }

  getDevice(name: string): SmartDevice | undefined {
    return this.getAllDevices().find(d => d.name === name);
  }

  set(rs: Room[]) {
    this.rooms = rs;
    this.listeners.forEach((l) => l());
  }

  reset(){
    this.rooms.forEach(room => room.reset())
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
}

export const allRoomStore = new roomStore([]);

export function useRoomStore() {
  const allRooms = useSyncExternalStore(
          (cb) => allRoomStore.subscribe(cb),
          () => allRoomStore.getAll());

  const completed = useMemo(
          () => (allRooms.filter(r => r.isCompleted)), [allRooms]);

  const nonCompleted = useMemo(() => (allRooms.filter(d => !d.isCompleted)), [allRooms]);

  return {allRooms, completed, nonCompleted};
}
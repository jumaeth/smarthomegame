import {Direction, Position} from "@/types/movement";

export type Spawn = { pos: Position; face?: Direction };
export type SpawnTable = Partial<Record<MapKey, Spawn>>;
export type SpawnDirectory = Record<MapKey, SpawnTable>;

export type MapSettings = {
  name: string;
  colMap: number[];
  rowMap: number[];
}

export type Transition = {
  pos: Position;
  to: MapKey;
}

export type Overlay = {
  pos: Position;
  device: DeviceKey;
}

export type MapKey =
        | 'livingroom'
        | 'hallway'
        | 'kitchen'
        ;

export type DeviceKey=
        | 'smartlights'
        | 'securitycamera'
        | 'smarttv'
        ;
import {Position} from "@/types/movement";

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
        | 'bathroom'
        ;

export type DeviceKey=
        | 'smartlights'
        | 'securitycamera'
        | 'smarttv'
        ;
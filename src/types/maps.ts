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

export type MapKey =
        | 'livingroom'
        | 'hallway'
        | 'kitchen'
        ;
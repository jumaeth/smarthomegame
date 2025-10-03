import {MapKey, Overlay, Spawn, SpawnTable, Transition} from "@/types/maps";
import {Position} from "@/types/movement.ts";

export const HALLWAY_COL_MAP: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
];

const SPAWN_FROM_LIVINGROOM = {x: 3, y: 3} as Position;
const SPAWN_FROM_KITCHEN = {x: 10, y: 3} as Position;

export const HALLWAY_TRANSITIONS: Transition[] = [
  {pos: SPAWN_FROM_LIVINGROOM, to: 'livingroom'},
  {pos: SPAWN_FROM_KITCHEN, to: 'kitchen'},
];

export const HALLWAY_OVERLAYS: Overlay[] = [
];

export const HALLWAY_SPAWNS: SpawnTable = {
  livingroom: { pos: SPAWN_FROM_LIVINGROOM, face: "DOWN" },
  kitchen:    { pos: SPAWN_FROM_KITCHEN,    face: "DOWN" },
};
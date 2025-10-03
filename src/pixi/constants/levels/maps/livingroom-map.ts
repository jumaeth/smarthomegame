import {MapKey, Overlay, Spawn, SpawnTable, Transition} from "@/types/maps";
import {Position} from "@/types/movement.ts";

export const LIVINGROOM_COL_MAP: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1,
  1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
];

const LIVINGROOM_SPAWN_POS = {x: 9, y: 9} as Position;

export const LIVINGROOM_TRANSITIONS: Transition[] = [
  {pos: LIVINGROOM_SPAWN_POS, to: 'hallway'},
];

export const LIVINGROOM_OVERLAYS: Overlay[] = [
  {pos: {x: 15, y: 6}, device: 'securitycamera'},
  {pos: {x: 2, y: 3}, device: 'smartlights'},
];

export const LIVINGROOM_SPAWNS: SpawnTable = {
  hallway: { pos: LIVINGROOM_SPAWN_POS, face: "UP" }
};
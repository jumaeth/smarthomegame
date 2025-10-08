import {MapKey, Spawn, Transition} from '@/types/maps';
import { MAP_TRANSITIONS } from '@/pixi/constants/levels/map-transitions';
import {MAP_SPAWNS} from "@/utils/mapSpawns.ts";

export function getMapTransition(map: MapKey, x: number, y: number) {
  const transitions = MAP_TRANSITIONS[map] || [];
  return transitions.find(t => t.pos.x === x && t.pos.y === y);
}
export function getSpawnForMap(dest: MapKey, from: MapKey): Spawn | undefined {
  return MAP_SPAWNS[dest]?.[from];
}

export function getTransitionsForMap(map: MapKey): Transition[] {
  return MAP_TRANSITIONS[map] ?? [];
}
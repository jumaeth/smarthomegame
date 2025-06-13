import {MapKey, Transition} from '@/types/maps';
import { MAP_TRANSITIONS } from '@/pixi/constants/levels/map-transitions';

export function getMapTransition(map: MapKey, x: number, y: number) {
  const transitions = MAP_TRANSITIONS[map] || [];
  return transitions.find(t => t.pos.x === x && t.pos.y === y);
}

export function getSpawnForMap(destinationMap: MapKey, previousMap: MapKey): Transition | undefined {
  const transitions = MAP_TRANSITIONS[destinationMap] || [];
  return transitions.find(t => t.to === previousMap);
}
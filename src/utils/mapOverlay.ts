import {MapKey} from '@/types/maps';
import {MAP_OVERLAYS} from "@/pixi/constants/levels/map-overlays";

export function getMapOverlay(map: MapKey, x: number, y: number) {
  const overlays = MAP_OVERLAYS[map] || [];
  return overlays.find(t => t.pos.x === x && t.pos.y === y);
}
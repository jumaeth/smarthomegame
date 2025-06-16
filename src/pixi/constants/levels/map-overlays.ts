import {MapKey, Overlay} from '@/types/maps';
import {LIVINGROOM_OVERLAYS} from "@/pixi/constants/levels/maps/livingroom-map";
import {HALLWAY_OVERLAYS} from "@/pixi/constants/levels/maps/hallway-map";
import {KITCHEN_OVERLAYS} from "@/pixi/constants/levels/maps/kitchen-map";

export const MAP_OVERLAYS: Record<MapKey, Overlay[]> = {
  hallway: HALLWAY_OVERLAYS,
  livingroom: LIVINGROOM_OVERLAYS,
  kitchen: KITCHEN_OVERLAYS,
};
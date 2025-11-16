import { MapKey } from '@/types/maps';
import { LIVINGROOM_COL_MAP } from './maps/livingroom-map';
import { HALLWAY_COL_MAP } from './maps/hallway-map';
import { KITCHEN_COL_MAP } from './maps/kitchen-map';
import {BATHROOM_COL_MAP} from "@/pixi/constants/levels/maps/bathroom-map.ts";
import {BEDROOM_COL_MAP} from "@/pixi/constants/levels/maps/bedroom-map.ts";

export const LEVEL_COLLISION_MAPS: Record<MapKey, number[][]> = {
  livingroom: LIVINGROOM_COL_MAP,
  hallway: HALLWAY_COL_MAP,
  kitchen: KITCHEN_COL_MAP,
  bathroom: BATHROOM_COL_MAP,
  bedroom: BEDROOM_COL_MAP,
};
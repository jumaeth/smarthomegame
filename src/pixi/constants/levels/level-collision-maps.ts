import { MapKey } from '@/types/maps';
import { LIVINGROOM_COL_MAP } from './maps/livingroom-map';
import { HALLWAY_COL_MAP } from './maps/hallway-map';
import { KITCHEN_COL_MAP } from './maps/kitchen-map';

export const LEVEL_COLLISION_MAPS: Record<MapKey, number[]> = {
  livingroom: LIVINGROOM_COL_MAP,
  hallway: HALLWAY_COL_MAP,
  kitchen: KITCHEN_COL_MAP,
};
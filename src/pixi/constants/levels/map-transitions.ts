import {MapKey, Transition} from '@/types/maps';
import { HALLWAY_TRANSITIONS } from './maps/hallway-map';
import {LIVINGROOM_TRANSITIONS} from "@/pixi/constants/levels/maps/livingroom-map";
import {KITCHEN_TRANSITIONS} from "@/pixi/constants/levels/maps/kitchen-map";
import {BATHROOM_TRANSITIONS} from "@/pixi/constants/levels/maps/bathroom-map.ts";
import {BEDROOM_TRANSITIONS} from "@/pixi/constants/levels/maps/bedroom-map.ts";

export const MAP_TRANSITIONS: Record<MapKey, Transition[]> = {
  hallway: HALLWAY_TRANSITIONS,
  livingroom: LIVINGROOM_TRANSITIONS,
  kitchen: KITCHEN_TRANSITIONS,
  bathroom: BATHROOM_TRANSITIONS,
  bedroom: BEDROOM_TRANSITIONS,
};
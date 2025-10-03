import {MapKey, Spawn, SpawnDirectory} from "@/types/maps.ts";
import {HALLWAY_SPAWNS} from "@/pixi/constants/levels/maps/hallway-map.ts";
import {LIVINGROOM_SPAWNS} from "@/pixi/constants/levels/maps/livingroom-map.ts";
import {KITCHEN_SPAWNS} from "@/pixi/constants/levels/maps/kitchen-map.ts";

export const MAP_SPAWNS: SpawnDirectory = {
  hallway: HALLWAY_SPAWNS,
  livingroom: LIVINGROOM_SPAWNS,
  kitchen: KITCHEN_SPAWNS,
};
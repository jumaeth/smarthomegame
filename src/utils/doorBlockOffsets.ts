import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {RoomName} from "@/objects/Room.ts";


export type BlockOffset = {
  x: number;
  y: number;
  bx: number;
  by: number;
}
export function getBlockOffset(name: RoomName){
  switch (name){
    case "kitchen":
      return {x: TILE_SIZE * 0.5, y: TILE_SIZE * 0.2, bx: TILE_SIZE * 0.11, by: TILE_SIZE * 0.125} as BlockOffset;
    case "livingroom":
      return {x: TILE_SIZE * 0.5, y: -TILE_SIZE * 0.15, bx: TILE_SIZE*0.1, by:  -TILE_SIZE * 0.2} as BlockOffset;
    default:
      return {x: 0, y: 0} as BlockOffset;
  }
}
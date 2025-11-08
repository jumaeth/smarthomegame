import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {RoomNames} from "@/objects/RoomNames.ts";
import {LIVINGROOM_DOOR_POS} from "@/pixi/constants/levels/maps/livingroom-map.ts";
import {
  HALLWAY_TO_BATHROOM_DOOR_POS,
  HALLWAY_TO_KITCHEN_DOOR_POS,
  HALLWAY_TO_LIVINGROOM_DOOR_POS
} from "@/pixi/constants/levels/maps/hallway-map.ts";


export type BlockOffset = {
  x: number; //circle x
  y: number; //circle y
  bx: number; //circle bar x
  by: number; //circle bar y
}
export function getBlockOffset(from: RoomNames, to: RoomNames, ww: number, wh: number){

  const CIRCLE_OFFSET_X = ww * 0.00625
  const BAR_OFFSET_X = ww * 0.001275

  switch (from){
    case RoomNames.LIVINGROOM:
    case RoomNames.KITCHEN:
    case RoomNames.BATHROOM:
      return {
        x: LIVINGROOM_DOOR_POS.x * TILE_SIZE + CIRCLE_OFFSET_X,
        y: LIVINGROOM_DOOR_POS.y * TILE_SIZE - wh * 0.0065,
        bx:  LIVINGROOM_DOOR_POS.x * TILE_SIZE  + BAR_OFFSET_X,
        by: LIVINGROOM_DOOR_POS.y * TILE_SIZE - wh * 0.008
      } as BlockOffset;
    case RoomNames.HALLWAY:
      switch (to){
        case RoomNames.LIVINGROOM:
          return {
            x: HALLWAY_TO_LIVINGROOM_DOOR_POS.x * TILE_SIZE + CIRCLE_OFFSET_X,
            y: HALLWAY_TO_LIVINGROOM_DOOR_POS.y * TILE_SIZE + wh * 0.0175,
            bx:  HALLWAY_TO_LIVINGROOM_DOOR_POS.x * TILE_SIZE  + BAR_OFFSET_X,
            by: HALLWAY_TO_LIVINGROOM_DOOR_POS.y * TILE_SIZE + wh * 0.016
          } as BlockOffset;
        case RoomNames.KITCHEN:
          return {
            x: HALLWAY_TO_KITCHEN_DOOR_POS.x * TILE_SIZE + CIRCLE_OFFSET_X,
            y: HALLWAY_TO_KITCHEN_DOOR_POS.y * TILE_SIZE + wh * 0.0175,
            bx:  HALLWAY_TO_KITCHEN_DOOR_POS.x * TILE_SIZE  + BAR_OFFSET_X,
            by: HALLWAY_TO_KITCHEN_DOOR_POS.y * TILE_SIZE + wh * 0.016
          } as BlockOffset;
        case RoomNames.BATHROOM:
          return {
            x: HALLWAY_TO_BATHROOM_DOOR_POS.x * TILE_SIZE + CIRCLE_OFFSET_X,
            y: HALLWAY_TO_BATHROOM_DOOR_POS.y * TILE_SIZE - wh * 0.0075,
            bx:  HALLWAY_TO_BATHROOM_DOOR_POS.x * TILE_SIZE  + BAR_OFFSET_X,
            by: HALLWAY_TO_BATHROOM_DOOR_POS.y * TILE_SIZE - wh * 0.009
          } as BlockOffset;
      }
    return {x: 0, y: 0, bx: 0, by: 0}
  }


  // switch (from){
  //   case RoomNames.KITCHEN:
  //     return {x: ww * 0.01, y: wh * 0.01, bx: ww * 0.01, by: wh * 0.01} as BlockOffset;
  //   case RoomNames.LIVINGROOM:
  //     return {x: ww * 0.0065, y: wh * 0.0065, bx: ww * 0.0015, by:  wh* 0.005} as BlockOffset;
  //   default:
  //     return {x: 0, y: 0} as BlockOffset;
  // }
}
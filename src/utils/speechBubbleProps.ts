import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {SpeechBubbleProps} from "@/pixi/components/SpeechBubble.tsx";

export function getSpeechBubbleProps(device: string, x: number, y: number): SpeechBubbleProps{

  switch (device){
    case "HallwayFrog":
      return {
        x: x + TILE_SIZE * 15.75,
        y: y + TILE_SIZE * 7.85,
        width: TILE_SIZE,
        height: TILE_SIZE * 0.3,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
      };
    case "LivingRoomCandles":
      return {
        x: x + TILE_SIZE * 8.9,
        y: y + TILE_SIZE * 4.7,
        height: TILE_SIZE * 0.4,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.05
      };

    case "LivingRoomFood":
      return {
        x: x + TILE_SIZE * 15.6,
        y: y + TILE_SIZE * 4.7,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "KitchenPainting":
      return {
        x: x + TILE_SIZE * 5.19,
        y: y + TILE_SIZE * 3.05,
        height: TILE_SIZE * 0.35,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BathroomChick":
      return {
        x: x + TILE_SIZE * 14.525,
        y: y + TILE_SIZE * 6,
        height: TILE_SIZE * 0.4,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BathroomDrawer":
      return {
        x: x + TILE_SIZE * 1.55,
        y: y + TILE_SIZE * 5.7,
        height: TILE_SIZE * 0.4,
        width: TILE_SIZE + 1.2,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };
    default:
      return {x: 0, y: 0, element: "", color: 0xffffff, textColor: 0x000000} as SpeechBubbleProps;
  }
}
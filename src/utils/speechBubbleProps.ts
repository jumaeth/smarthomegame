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

    case "HallwayPets":
      return {
        x: x * TILE_SIZE + TILE_SIZE * 1.25,
        y: y *TILE_SIZE + TILE_SIZE * 0.75,
        width: TILE_SIZE,
        height: TILE_SIZE * 0.4,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
      };

    case "HallwayEntryDoor":
      return {
        x: x * TILE_SIZE + TILE_SIZE * 0.5,
        y: y *TILE_SIZE + TILE_SIZE * 0.75,
        width: TILE_SIZE,
        height: TILE_SIZE * 0.4,
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
        y: y + TILE_SIZE * 2.975,
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

    case "BathroomToilet":
      return {
        x: x * TILE_SIZE + TILE_SIZE * 0.45,
        y: y * TILE_SIZE,
        height: TILE_SIZE * 0.4,
        width: TILE_SIZE + 1.2,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BedroomFish":
      return {
        x: x * TILE_SIZE + TILE_SIZE ,
        y: y * TILE_SIZE - TILE_SIZE * 0.9,
        height: TILE_SIZE * 0.3,
        width: TILE_SIZE + 0.3,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BedroomChildBed":
      return {
        x: x * TILE_SIZE + TILE_SIZE *0.825,
        y: y * TILE_SIZE - TILE_SIZE *0.6,
        height: TILE_SIZE * 0.2,
        width: TILE_SIZE * 0.5,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BedroomWardrobe":
      return {
        x: x * TILE_SIZE + TILE_SIZE * 0.925,
        y: y * TILE_SIZE + TILE_SIZE,
        height: TILE_SIZE * 0.6,
        width: TILE_SIZE,
        textSize: 2.5,
        element: "",
        color: 0x2c2b33,
        textColor: 0xffffff,
        textXOffset: TILE_SIZE * 0.025,
      };

    case "BedroomRadio":
      return {
        x: x * TILE_SIZE + TILE_SIZE * 0.5,
        y: y * TILE_SIZE - TILE_SIZE * 0.1,
        height: TILE_SIZE * 0.3,
        width: TILE_SIZE * 1.25,
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
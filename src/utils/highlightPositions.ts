import {RoundedRectangle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";

export function getHighlightPosition(device: InteractivePixiElement){

  switch (device.name){
    case "SmartTv":
      return new RoundedRectangle(
              device.x*TILE_SIZE+TILE_SIZE*0.2,
              device.y*TILE_SIZE-TILE_SIZE*0.06,
              device.width*0.83,
              device.height+TILE_SIZE*0.025,
              1);
    case "SmartLights":
      return new RoundedRectangle(
              device.x*TILE_SIZE+TILE_SIZE*0.025,
              device.y*TILE_SIZE+TILE_SIZE*0.25,
              device.width*0.9,
              device.height+TILE_SIZE*0.05,
              1);
    case "SecurityCamera":
      return new RoundedRectangle(
              device.x*TILE_SIZE-TILE_SIZE*0.035,
              device.y*TILE_SIZE-TILE_SIZE*0.25,
              device.width-TILE_SIZE*0.019,
              device.height-TILE_SIZE*0.03,
              1);
    case "SmartHomeHub":
      return new RoundedRectangle(
              device.x*TILE_SIZE - TILE_SIZE * 0.04,
              device.y*TILE_SIZE+TILE_SIZE*0.7,
              device.width-TILE_SIZE*0.003,
              device.height-TILE_SIZE*0.0225,
              0.5);
    case "SmartKitchen":
      return new RoundedRectangle(
              device.x*TILE_SIZE-TILE_SIZE*0.025,
              device.y*TILE_SIZE-TILE_SIZE*0.15,
              device.width+TILE_SIZE*0.003,
              device.height+TILE_SIZE*0.0025,
              1);
    default:
      return new RoundedRectangle(device.x*TILE_SIZE,device.y*TILE_SIZE,device.width,device.height,1);
  }
}
import {RoundedRectangle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";

export function getHighlightPosition(device: InteractivePixiElement) {

  switch (device.name) {
    case "SmartTv":
      return new RoundedRectangle(
              device.x * TILE_SIZE + 3.4,
              device.y * TILE_SIZE - 2,
              device.width - 0.37,
              device.height + 0.4,
              1);
    case "SmartLights":
      return new RoundedRectangle(
              device.x * TILE_SIZE + 1,
              device.y * TILE_SIZE + 2.8,
              device.width - 0.2,
              device.height - 0.22,
              1);
    case "SecurityCamera":
      return new RoundedRectangle(
              device.x * TILE_SIZE - 0.5,
              device.y * TILE_SIZE - (2 * TILE_SIZE) + 10, // remove two tiles because camera is placed 2 tiles above player, then add/remove missing pixels
              device.width - 0.3,
              device.height - 0.45,
              1);
    case "SmartHomeHub":
      return new RoundedRectangle(
              device.x * TILE_SIZE - 1,
              device.y * TILE_SIZE + TILE_SIZE - 6, // add one tile because hub is placed further down than player can reach
              device.width,
              device.height - 0.35,
              0.5);
    case "SmartKitchen":
      return new RoundedRectangle(
              device.x * TILE_SIZE,
              device.y * TILE_SIZE - 2,
              device.width,
              device.height + 0.05,
              1);
    default:
      return new RoundedRectangle(device.x * TILE_SIZE, device.y * TILE_SIZE, device.width, device.height, 1);
  }
}
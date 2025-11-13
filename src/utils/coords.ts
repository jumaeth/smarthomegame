import { TILE_SIZE } from "@/pixi/constants/world-settings";

export function pixelToTile(px: number, py: number) {
  // subtract any world offsets first, then divide, then floor
  const tx = Math.floor(px / TILE_SIZE);
  const ty = Math.floor(py / TILE_SIZE);
  return { x: tx, y: ty };
}
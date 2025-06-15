import { Texture } from "@pixi/core";
import * as PIXI from "pixi.js";

export function loadTexture(image: string, scaleMode = PIXI.SCALE_MODES.NEAREST): Texture {
  const tex = Texture.from(image);
  tex.baseTexture.scaleMode = scaleMode;
  return tex;
}
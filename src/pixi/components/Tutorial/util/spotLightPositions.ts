import {SpotRect} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import {TILE_SIZE, ZOOM} from "@/pixi/constants/world-settings.ts";
export const player = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
  x: windowWidth * 0.4925,
  y: base * 0.5,
  width: TILE_SIZE * ZOOM,
  height: TILE_SIZE * ZOOM,
  r: 10,
  } as SpotRect
}

export const introText = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
    x: windowWidth * 0.325,
    y: base * 0.3,
    width: windowWidth * 0.35,
    height: base * 0.15,
    r: 10,
  } as SpotRect
}

export const scores = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
    x: 0.84 * windowWidth,
    y: 0.01 * base,
    width: windowWidth * 0.15,
    height: base * 0.155,
    r: 10,
  } as SpotRect;
}

export const phone = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
    x: 0.007 * windowWidth,
    y: 0.0125 * base,
    width: windowWidth * 0.085,
    height: base * 0.25,
    r: 10,
  } as SpotRect;
}

export const tv = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
    x: windowWidth*0.165,
    y: 0,
    width: windowWidth * 0.155,
    height: base * 0.21,
    r: 10
  } as SpotRect;
}

export const tv2 = (windowWidth: number, windowHeight: number) => {
  const base = Math.min(windowWidth, windowHeight);
  return {
    x: windowWidth*0.42,
    y: base * 0.325,
    width: windowWidth * 0.1475,
    height: base * 0.21,
    r: 10
  } as SpotRect;
}
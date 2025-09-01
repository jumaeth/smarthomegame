import {SpotRect} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";

export const player = (windowWidth: number, windowHeight: number) => {
  return {
  x: (0.5*windowWidth),
  y: (0.5*windowHeight)+TILE_SIZE*1.75,
  width: TILE_SIZE*8,
  height: TILE_SIZE*8,
  r: 10,
  } as SpotRect
}

export const introText = (windowWidth: number, windowHeight: number) => {
  return {
    x: windowWidth * 0.325,
    y: windowHeight * 0.3,
    width: windowWidth * 0.35,
    height: windowHeight * 0.15,
    r: 10,
  } as SpotRect
}

export const scores = (windowWidth: number, windowHeight: number) => {
  return {
    x: (0.86*windowWidth),
    y: (0.01*windowHeight)-TILE_SIZE*0.25,
    width: TILE_SIZE*16.5,
    height: TILE_SIZE*7.5,
    r: 10,
  } as SpotRect;
}

export const phone = (windowWidth: number, windowHeight: number) => {
  return {
    x: (0.006*windowWidth),
    y: (0.0125*windowHeight),
    width: TILE_SIZE*8,
    height: TILE_SIZE*12,
    r: 10,
  } as SpotRect;
}

export const tv = (windowWidth: number, windowHeight: number) => {
  return {
    x: windowWidth*0.165,
    y: 0,
    width: windowWidth * 0.155,
    height: windowHeight * 0.21,
    r: 10
  } as SpotRect;
}

export const tv2 = (windowWidth: number, windowHeight: number) => {
  return {
    x: windowWidth*0.42,
    y: windowHeight*0.325,
    width: windowWidth * 0.1475,
    height: windowHeight * 0.21,
    r: 10
  } as SpotRect;
}
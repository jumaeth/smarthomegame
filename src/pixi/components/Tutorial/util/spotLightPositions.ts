import {SpotRect} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";

export const player = (windowWidth: number, windowHeight: number) => {
  return {
  x: 0.5*windowWidth,
  y: 0.55*windowHeight,
  width: windowWidth * 0.1,
  height: windowHeight * 0.2,
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
    x: 0.84*windowWidth,
    y: 0.01*windowHeight,
    width: windowWidth * 0.15,
    height: windowHeight * 0.155,
    r: 10,
  } as SpotRect;
}

export const phone = (windowWidth: number, windowHeight: number) => {
  return {
    x: 0.007*windowWidth,
    y: 0.0125*windowHeight,
    width: windowWidth * 0.085,
    height: windowHeight * 0.25,
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
// anim/spotlightTweens.ts
import { AnimationManager, easeInOutQuad } from "./AnimationManager";
import {drawSpotlight} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {RefObject} from "react";
import {Graphics as PixiGraphics} from "pixi.js"

export type SpotRect = { x: number; y: number; width: number; height: number; r: number };

export function spotlightAnimation(
        mgr: AnimationManager,
        bgRef: RefObject<PixiGraphics>,
        windowWith: number,
        windowHeight: number,
        from: SpotRect,
        to: SpotRect,
        duration: number,
        ease = easeInOutQuad
) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return mgr.play({
    duration,
    ease,
    onUpdate: (p) => {
      drawSpotlight({
        x: lerp(from.x, to.x, p),
        y: lerp(from.y, to.y, p),
        width: lerp(from.width, to.width, p),
        height: lerp(from.height, to.height, p),
        r: lerp(from.r, to.r, p),
      }, bgRef, windowWith, windowHeight);
    },
  });
}

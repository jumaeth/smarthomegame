import {SpotRect} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import type {DisplayObject as PixiDisplayObject, Graphics as PixiGraphics} from "pixi.js";
import {RefObject} from "react";

export const drawBackground = (backgroundRef: RefObject<PixiGraphics>, windowWidth: number, windowHeight: number)=> {
  const g = backgroundRef.current;
  if (g) {
    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.endFill();
  }
}

export const drawSpotlight = (rect: SpotRect, backgroundRef: RefObject<PixiGraphics>, windowWidth: number, windowHeight: number) => {
  const g = backgroundRef.current;
  if (!g || !rect) return;

  g.clear();
  g.alpha = 0.7;
  g.beginFill(0x000000);
  g.drawRect(0, 0, windowWidth, windowHeight);
  g.beginHole();
  g.drawRoundedRect(rect.x, rect.y, rect.width, rect.height, rect.r);
  g.endHole();
  g.endFill();
};

export const toggleExplanations = (refs: PixiDisplayObject[], visibility: boolean) => {
  refs.forEach(c => {
    if (!c) return;
    c.alpha = visibility ? 1 : 0;
    c.renderable = visibility;
  });
}
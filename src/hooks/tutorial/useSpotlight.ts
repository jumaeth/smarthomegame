// hooks/useSpotlight.ts
import { useEffect, useRef, useCallback, useMemo } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import { AnimationManager } from "@/pixi/components/Tutorial/anim/AnimationManager";
import { spotlightAnimation } from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import { fadeAnimation, FadeProps } from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";

export type SpotRect = { x: number; y: number; width: number; height: number; r: number };

type UseSpotlightOptions = {
  windowWidth: number;
  windowHeight: number;
  animationManager?: AnimationManager; // optional: pass one in, or hook will create its own
};

export function useSpotlight({ windowWidth, windowHeight, animationManager }: UseSpotlightOptions) {
  const backgroundRef = useRef<PixiGraphics | null>(null);
  const spotRectRef = useRef<SpotRect | null>(null);
  const mgrRef = useRef<AnimationManager | null>(animationManager ?? null);

  // create internal AnimationManager if one wasn't provided
  useEffect(() => {
    if (mgrRef.current) return;
    mgrRef.current = new AnimationManager();
    return () => {
      try { mgrRef.current?.cancelAll?.(); } catch {}
      mgrRef.current = null;
    };
  }, []);

  const drawMask = useCallback((rect: SpotRect) => {
    const g = backgroundRef.current;
    if (!g) return;

    spotRectRef.current = rect;
    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.beginHole();
    g.drawRoundedRect(rect.x, rect.y, rect.width, rect.height, rect.r);
    g.endHole();
    g.endFill();
  }, [windowWidth, windowHeight]);

  const drawDim = useCallback(() => {
    const g = backgroundRef.current;
    if (!g) return;
    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.endFill();
  }, [windowWidth, windowHeight]);

  const showBetween = useCallback(async (start: SpotRect, end: SpotRect, duration = 1000) => {
    const mgr = mgrRef.current!;
    await mgr.sequence([
      () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, start, end, duration),
    ]);
  }, [drawMask]);

  const setVisibleRect = useCallback((rect: SpotRect) => {
    drawMask(rect);
  }, [drawMask]);

  const clearToDim = useCallback(() => {
    drawDim();
  }, [drawDim]);

  const fadeOutBackground = useCallback(async (duration = 1000) => {
    const mgr = mgrRef.current;
    const g = backgroundRef.current;
    if (!mgr || !g) return;

    const fadeOut: FadeProps = { duration, startA: g.alpha ?? 1, endA: 0 };
    await mgr.parallel([() => fadeAnimation(mgr, g, fadeOut)]);
  }, []);


  useEffect(() => {
    if (spotRectRef.current) drawMask(spotRectRef.current);
  }, [windowWidth, windowHeight, drawMask]);

  return useMemo(() => ({
    backgroundRef,
    showBetween,
    setVisibleRect,
    clearToDim,
    fadeOutBackground,
  }), [showBetween, setVisibleRect, clearToDim, fadeOutBackground]);
}

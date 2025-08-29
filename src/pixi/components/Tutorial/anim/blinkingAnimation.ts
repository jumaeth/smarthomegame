import type { DisplayObject as PixiDisplayObject, Sprite as PixiSprite } from "pixi.js";
import type { Ease } from "./AnimationManager";
import { AnimationManager, easeInOutQuad } from "./AnimationManager";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {FADE_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";

export type GrowProps = {
  duration: number;
  startX: number; startY: number; startS: number;
  endX: number; endY: number; endS: number;
  ease?: Ease;
};

export function blinkingAnimation(
        mgr: AnimationManager,
        sprite: PixiDisplayObject,
        speed: number,
        pressedRef,
        onStart?: () => void,
        onComplete?: () => void
): { promise: Promise<void> } {

  onStart?.();

  const { promise } = mgr.runUntil(
          () => {
            return [
              () => ({

                promise: mgr.sequence([
                  () => fadeAnimation(mgr, sprite, {duration: speed, startA: 0.8, endA: 0}),
                  () => fadeAnimation(mgr, sprite, {duration: speed, startA: 0, endA: 0.8})
                ])
              }),
            ];
          },
          { mode: "sequence", until: () => pressedRef.current, delayMs: 100 }
  );

  return { promise };
}

import type {DisplayObject as PixiDisplayObject} from "pixi.js";
import {AnimationManager} from "./AnimationManager";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {RefObject} from "react";

export function blinkingAnimation(
        mgr: AnimationManager,
        sprite: PixiDisplayObject,
        speed: number,
        pressedRef: RefObject<boolean>,
        onStart?: () => void,
): { promise: Promise<void> } {

  onStart?.();

  const pressed = pressedRef.current;
  if (!pressed) return { promise: Promise.resolve() };
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
          { mode: "sequence", until: () => pressed, delayMs: 100 }
  );

  return { promise };
}

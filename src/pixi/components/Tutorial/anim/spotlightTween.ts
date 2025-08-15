// anim/spotlightTweens.ts
import { AnimationManager, easeInOutQuad } from "./AnimationManager";

export type SpotRect = { x: number; y: number; width: number; height: number; r: number };

export function spotlightTween(
        mgr: AnimationManager,
        drawHole: (rect: SpotRect) => void,
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
      drawHole({
        x: lerp(from.x, to.x, p),
        y: lerp(from.y, to.y, p),
        width: lerp(from.width, to.width, p),
        height: lerp(from.height, to.height, p),
        r: lerp(from.r, to.r, p),
      });
    },
  });
}

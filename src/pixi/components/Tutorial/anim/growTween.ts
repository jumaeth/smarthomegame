// anim/growTween.ts
import type { Sprite as PixiSprite } from "pixi.js";
import type { Ease } from "./AnimationManager";
import { AnimationManager, easeInOutQuad } from "./AnimationManager";

export type GrowProps = {
  duration: number;
  startX: number; startY: number; startS: number;
  endX: number; endY: number; endS: number;
  ease?: Ease;
};

/** A generic "grow & move" tween for sprites */
export function growAnimation(
        mgr: AnimationManager,
        sprite: PixiSprite,
        props: GrowProps,
        onStart?: () => void,
        onComplete?: () => void
) {
  const ease = props.ease ?? easeInOutQuad;

  // initialize pose once up front
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(props.startX, props.startY);
  sprite.scale.set(props.startS);
  onStart?.();

  return mgr.play({
    duration: props.duration,
    ease,
    onUpdate: (p) => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      sprite.position.set(lerp(props.startX, props.endX, p), lerp(props.startY, props.endY, p));
      const s = lerp(props.startS, props.endS, p);
      sprite.scale.set(s);
    },
    onComplete,
  });
}

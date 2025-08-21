import type { DisplayObject as PixiDisplayObject} from "pixi.js";
import type { Ease } from "./AnimationManager";
import { AnimationManager, easeInOutQuad } from "./AnimationManager";
import {Simulate} from "react-dom/test-utils";
import durationChange = Simulate.durationChange;

export type FadeProps = {
  duration: number;
  startA: number;
  endA: number;
  ease?: Ease;
};

/** A generic "grow & move" tween for sprites */
export function fadeAnimation(
        mgr: AnimationManager,
        container: PixiDisplayObject,
        props: FadeProps,
        onStart?: () => void,
        onComplete?: () => void
) {
  const ease = props.ease ?? easeInOutQuad;

  // initialize pose once up front

  container.alpha = props.startA;
  onStart?.();

  return mgr.play({
    duration: props.duration,
    ease,
    onUpdate: (p) => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      container.alpha = lerp(props.startA, props.endA, p);
    },
    onComplete,
  });
}

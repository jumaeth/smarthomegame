import type { DisplayObject as PixiDisplayObject } from "pixi.js";
import type { Ease } from "./AnimationManager";
import { easeInOutQuad, AnimationManager } from "./AnimationManager";

export type FadeProps = {
  duration: number;
  startA: number;
  endA: number;
  ease?: Ease;
};

/**
 * Fade one or many DisplayObjects from startA -> endA.
 * Returns `{ promise }` to fit AnimationManager.sequence/parallel.
 */
export function fadeAnimation(
        mgr: AnimationManager,
        targets: PixiDisplayObject | PixiDisplayObject[],
        props: FadeProps,
        onStart?: () => void,
        onComplete?: () => void
): { promise: Promise<void> } {
  const ease = props.ease ?? easeInOutQuad;
  const sprites = Array.isArray(targets) ? targets : [targets];

  sprites.forEach(s => {
    (s as any).alpha = props.startA;
  });
  onStart?.();

  const tweens = sprites.map(s =>
          mgr.play({
            duration: props.duration,
            ease,
            onUpdate: (p) => {
              const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
              (s as any).alpha = lerp(props.startA, props.endA, p);
            },
          })
  );

  const promise: Promise<void> = Promise.all(tweens.map(t => t.promise)).then(() => {
    onComplete?.();
  });

  return { promise };
}

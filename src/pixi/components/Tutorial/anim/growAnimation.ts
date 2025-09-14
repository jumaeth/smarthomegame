import type { DisplayObject as PixiDisplayObject, Sprite as PixiSprite } from "pixi.js";
import type { Ease } from "./AnimationManager";
import { AnimationManager, easeInOutQuad } from "./AnimationManager";

export type GrowProps = {
  duration: number;
  startX: number; startY: number; startS: number;
  endX: number; endY: number; endS: number;
  ease?: Ease;
};

export function growAnimation(
        mgr: AnimationManager,
        spritesOrOne: PixiDisplayObject | PixiDisplayObject[],
        props: GrowProps,
        onStart?: () => void,
        onComplete?: () => void
): { promise: Promise<void> } {
  const ease = props.ease ?? easeInOutQuad;
  const sprites = Array.isArray(spritesOrOne) ? spritesOrOne : [spritesOrOne];

  sprites.forEach(sprite => {
    (sprite as PixiSprite).anchor?.set(0.5, 0.5);
    sprite.position.set(props.startX, props.startY);
    sprite.scale.set(props.startS);
  });

  onStart?.();

  const tweens = sprites.map(sprite =>
          mgr.play({
            duration: props.duration,
            ease,
            onUpdate: (p) => {
              const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
              sprite.position.set(
                      lerp(props.startX, props.endX, p),
                      lerp(props.startY, props.endY, p)
              );
              sprite.scale.set(lerp(props.startS, props.endS, p));
            },
          })
  );

  const promise: Promise<void> =
          Promise.all(tweens.map(t => t.promise)).then(() => { onComplete?.(); });

  return { promise };
}

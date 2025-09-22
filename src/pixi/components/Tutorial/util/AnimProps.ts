import {FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {FADE_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";

export const FADE_IN: FadeProps = {
  duration: FADE_DURATION,
  startA: 0,
  endA: 1,
}

export const FADE_OUT: FadeProps = {
  duration: FADE_DURATION,
  startA: 1,
  endA: 0,
}
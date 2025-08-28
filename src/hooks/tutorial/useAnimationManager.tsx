import { useEffect, useRef } from "react";
import { useApp } from "@pixi/react";
import { AnimationManager } from "@/pixi/components/Tutorial/anim/AnimationManager.ts";

export function useAnimationManager() {
  const app = useApp();
  const mgrRef = useRef<AnimationManager | null>(null);

  useEffect(() => {
    mgrRef.current = new AnimationManager();
    try{
      mgrRef.current?.cancelAll()
    }catch (e: Error){}
    return;
  }, []);

  return mgrRef;
}
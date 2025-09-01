import {useEffect, useRef} from "react";
import {AnimationManager} from "@/pixi/components/Tutorial/anim/AnimationManager.ts";

export function useAnimationManager() {
  const mgrRef = useRef<AnimationManager | null>(null);

  useEffect(() => {
    mgrRef.current = new AnimationManager();
    try{
      mgrRef.current?.cancelAll()
    }catch (e){
      console.log(e)}
    return;
  }, []);

  return mgrRef;
}
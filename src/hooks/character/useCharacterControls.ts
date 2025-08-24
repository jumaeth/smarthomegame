import {useCallback, useEffect, useMemo, useState} from "react";
import {Direction} from "@/types/movement";
import {DIRECTION_KEYS} from "@/pixi/constants/key-mappings";

export const useCharacterControls = () => {
  const [heldDirection, setHeldDirection] = useState<Direction[]>([]);
  const [heldProgDir, setHeldProgDir] = useState<Direction[]>([]);

  /**
   * Handles key down and key up events to update the held direction state.
   * Since there are always two keys pressed at the same time, we filter out the second key
   */
  const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
    const direction = DIRECTION_KEYS[e.code];
    if (!direction) return;
    setHeldDirection((prev) => {
      if (isKeyDown) {
        return prev.includes(direction)?prev:[direction, ...prev]
      }
      return prev.filter((dir) => dir !== direction);
    });
  }, [])

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => handleKey(e, true);
    const handleKeyUp = (e:KeyboardEvent) => handleKey(e, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleKey]);

  // const getControlsDirection = useCallback(() => {
  //   return heldDirection[0] || null;
  // }, [heldDirection]);



  //control character programmatically

  const move = useCallback((dir: Direction) => {
    setHeldProgDir((prev) => (prev.includes(dir) ? prev : [dir, ...prev]));
  }, []);

  const stop = useCallback((dir?: Direction) => {
    if (!dir) {
      setHeldProgDir([]);
    } else {
      setHeldProgDir((prev) => prev.filter((d) => d !== dir));
    }
  }, []);

  const mergedHeld = useMemo<Direction[]>(() => {
    const merged = [...heldProgDir, ...heldDirection.filter((d) => !heldProgDir.includes(d))];
    return merged;
  }, [heldProgDir, heldDirection]);

  const getControlsDirection = useCallback(() => mergedHeld[0] || null, [mergedHeld]);

  return {getControlsDirection, move, stop};
}
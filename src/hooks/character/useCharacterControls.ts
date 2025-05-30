import {useCallback, useEffect, useState} from "react";
import {Direction} from "@/types/movement";
import {DIRECTION_KEYS} from "@/pixi/constants/key-mappings";

export const useCharacterControls = () => {
  const [heldDirection, setHeldDirection] = useState<Direction[]>([]);

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

  const getControlsDirection = useCallback(() => {
    return heldDirection[0] || null;
  }, [heldDirection]);

  return {getControlsDirection};
}
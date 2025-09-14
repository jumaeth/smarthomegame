import {useCallback, useEffect, useMemo, useState} from "react";
import {DIRECTION_KEYS} from "@/pixi/constants/key-mappings.ts";
import {Direction} from "@/types/movement.ts";

export const useCharacterControls = () => {
  const [heldDirection, setHeldDirection] = useState<Direction[]>([]);
  const [ePressed, setEPressed] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
    const direction = DIRECTION_KEYS[e.code];
    if (direction) {
      setHeldDirection((prev) =>
              isKeyDown
                      ? prev.includes(direction) ? prev : [direction, ...prev]
                      : prev.filter((dir) => dir !== direction)
      );
    }

    if (e.code === "KeyE") {
      setEPressed(isKeyDown);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKey]);

  const direction = useMemo(() => heldDirection[0] ?? null, [heldDirection]);

  return {
    direction,
    ePressed,
  };
};

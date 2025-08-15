import { useSyncExternalStore } from "react";
import { characterPositionStore } from "@/utils/characterPosition.ts";
import { Position } from "@/types/movement";

export function useCharacterPosition(): Position {
  return useSyncExternalStore(
          (cb) => characterPositionStore.subscribe(() => cb()),
          () => characterPositionStore.get()
  );
}
import {characterPositionStore} from "@/utils/characterPosition.ts";
import {useSyncExternalStore} from "react";
import {Position} from "@/types/movement.ts";

export function useCharacterPosition(): Position {
  return useSyncExternalStore(
          (cb) => characterPositionStore.subscribe(cb), // <— pass through
          () => characterPositionStore.get()
  );
}

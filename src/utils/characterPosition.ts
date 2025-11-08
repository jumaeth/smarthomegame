import {Direction, Position} from "@/types/movement";
import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";

type Listener = () => void;
type TeleportListener = (p: TeleportPayload) => void;
type TeleportPayload = { pos: Position; dir?: Direction };


class PositionStore {
  private pos: Position;
  private listeners = new Set<Listener>();
  private tpListeners = new Set<TeleportListener>();
  private facing: Direction = "DOWN";

  constructor(initial: Position) {
    this.pos = initial;
  }

  get(): Position {
    return this.pos;
  }

  set(next: Position) {
    if (next.x === this.pos.x && next.y === this.pos.y) return;
    this.pos = next;
    this.listeners.forEach((l) => l());
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }


  teleport(next: Position, dir?: Direction) {
    this.set(next);
    if (dir) this.facing = dir;
    const payload: TeleportPayload = { pos: this.pos, dir };
    this.tpListeners.forEach(l => l(payload));
  }

  onTeleport(fn: TeleportListener) {
    this.tpListeners.add(fn);
    return () => { this.tpListeners.delete(fn); };
  }

  getFacing(): Direction { return this.facing; }
  setFacing(d: Direction) { this.facing = d; }

}

export const characterPositionStore = new PositionStore({
  x: DEFAULT_POS_X,
  y: DEFAULT_POS_Y,
});

import { useSyncExternalStore, useMemo } from "react";

export function useCharacterPosition() {
  const pos = useSyncExternalStore(
          (cb) => characterPositionStore.subscribe(cb),
          () => characterPositionStore.get()
  );

   const tile = useMemo(() => ({
             x: Math.floor(pos.x / TILE_SIZE),
            y: Math.floor(pos.y / TILE_SIZE),
           }), [pos]);

  return { pos, tile };
}

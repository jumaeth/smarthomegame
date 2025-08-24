// position-store.ts
import { Position } from "@/types/movement";
import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";

type Listener = () => void;
type TeleportListener = (pos: Position) => void;


class PositionStore {
  private pos: Position;
  private listeners = new Set<Listener>();
  private tpListeners = new Set<TeleportListener>();

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


  teleport(next: Position) {
    this.set(next);
    this.tpListeners.forEach(l => l(this.pos));
  }

  onTeleport(fn: TeleportListener) {
    this.tpListeners.add(fn);
    return () => { this.tpListeners.delete(fn); };
  }

  getTile() {
    return {
      x: Math.floor(this.pos.x / TILE_SIZE),
      y: Math.floor(this.pos.y / TILE_SIZE),
    };
  }

  setTile(tile: { x: number; y: number }) {
    this.set({ x: tile.x * TILE_SIZE, y: tile.y * TILE_SIZE });
  }

  teleportTile(tile: { x: number; y: number }) {
    this.setTile(tile);
  }

  moveByTiles(delta: { dx: number; dy: number }) {
    const t = this.getTile();
    this.setTile({ x: t.x + delta.dx, y: t.y + delta.dy });
  }
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

  // derive tiles once here so everyone gets a stable pair
  const tile = useMemo(() => characterPositionStore.getTile(), [pos.x, pos.y]);

  return { pos, tile };
}

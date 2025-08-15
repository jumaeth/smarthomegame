import { Position } from "@/types/movement";

type Listener = (pos: Position) => void;

class PositionStore {
  private pos: Position;
  private listeners = new Set<Listener>();

  constructor(initial: Position) {
    this.pos = initial;
  }

  get(): Position {
    return this.pos;
  }

  set(next: Position) {
    if (next.x === this.pos.x && next.y === this.pos.y) return;
    this.pos = next;
    this.listeners.forEach((l) => l(this.pos));
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.pos);
    return () => this.listeners.delete(fn);
  }

  teleport(next: Position) {
    this.set(next);
  }
}

export const characterPositionStore = new PositionStore({ x: 0, y: 0 });

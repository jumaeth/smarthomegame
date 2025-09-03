type Listener = () => void;

class BoolStore {
  private value = false;
  private listeners = new Set<Listener>();
  get() { return this.value; }
  set(v: boolean) {
    if (v === this.value) return;
    this.value = v;
    this.listeners.forEach(l => l());
  }
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
}
export const tutorialActiveStore = new BoolStore();

// Hook
import { useSyncExternalStore } from "react";
export function useTutorialActive() {
  const enabled = useSyncExternalStore(
          cb => tutorialActiveStore.subscribe(cb),
          () => tutorialActiveStore.get()
  );
  return {
    enabled,
    close: () => tutorialActiveStore.set(false),
    open:  () => tutorialActiveStore.set(true),
  };
}
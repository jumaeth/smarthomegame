type Listener = () => void;

class BoolStore {
  private value = true;
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
export const tutorialEnabledStore = new BoolStore();

// Hook
import { useSyncExternalStore } from "react";
export function useTutorialEnabled() {
  const enabled = useSyncExternalStore(
          cb => tutorialEnabledStore.subscribe(cb),
          () => tutorialEnabledStore.get()
  );
  return {
    enabled,
    close: () => tutorialEnabledStore.set(false),
    open:  () => tutorialEnabledStore.set(true),
  };
}
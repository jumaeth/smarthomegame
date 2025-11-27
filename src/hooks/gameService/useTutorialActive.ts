import {CookieService} from "@/services/CookieService"

type Listener = () => void;

class BoolStore {
  private value = false;
  private listeners = new Set<Listener>();
  get() { return this.value; }
  set(v: boolean) {
    if (v === this.value) return;
    this.value = v;
    CookieService.set("tutorialState", this.value)
    this.listeners.forEach(l => l());
  }
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
}
export const tutorialDoneStore = new BoolStore();

// Hook
import { useSyncExternalStore } from "react";
export function useTutorialActive() {
  const done = useSyncExternalStore(
          cb => tutorialDoneStore.subscribe(cb),
          () => tutorialDoneStore.get()
  );
  return {
    done: done,
    end: () => tutorialDoneStore.set(true),
    start:  () => tutorialDoneStore.set(false),
  };
}
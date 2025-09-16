import {useSyncExternalStore} from "react";

type State = { movementEnabled: boolean };

let state: State = { movementEnabled: true };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export const movementStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  enable: () => { state = { ...state, movementEnabled: true }; emit(); },
  disable: () => { state = { ...state, movementEnabled: false }; emit(); },
  toggle: () => { state = { ...state, movementEnabled: !state.movementEnabled }; emit(); },
};

export const useMovementStore = () => {
  // same fn for getSnapshot & getServerSnapshot (no SSR here)
  const snap = useSyncExternalStore(movementStore.subscribe, movementStore.getSnapshot, movementStore.getSnapshot);
  return {
    movementEnabled: snap.movementEnabled,
    enable: movementStore.enable,
    disable: movementStore.disable,
    toggle: movementStore.toggle,
  };
};
type Callback = () => void;

export class ProgressBarStatusStore {
  private static _shown = false;
  private static _subscribers = new Set<Callback>();

  static get(): boolean {
    return this._shown;
  }

  static set(value: boolean) {
    this._shown = value;
    this._notify();
  }

  static toggle() {
    this._shown = !this._shown;
    this._notify();
  }

  private static _notify() {
    for (const callback of this._subscribers) {
      callback();
    }
  }

  static subscribe(callback: Callback): () => void {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
}

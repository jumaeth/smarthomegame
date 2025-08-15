// anim/AnimationManager.ts
export type Ease = (t: number) => number;
export const linear: Ease = t => t;
export const easeInOutQuad: Ease = t => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2);

type InternalAnim = {
  id: number;
  start: number;
  duration: number;
  ease: Ease;
  onUpdate: (progress01: number) => void;
  onComplete?: () => void;
  resolve: () => void;
  reject: (err?: unknown) => void;
  cancelled: boolean;
};

export class AnimationManager {
  private anims = new Map<number, InternalAnim>();
  private raf: number | null = null;
  private nextId = 1;

  /** Add a tween; returns a handle + a promise to await completion */
  play(opts: {
    duration: number;
    ease?: Ease;
    onUpdate: (p: number) => void;
    onComplete?: () => void;
  }): { id: number; promise: Promise<void>; cancel: () => void } {
    const id = this.nextId++;
    const start = performance.now();
    const duration = Math.max(0, opts.duration);
    const ease = opts.ease ?? linear;

    let resolve!: () => void;
    let reject!: (err?: unknown) => void;
    const promise = new Promise<void>((res, rej) => { resolve = res; reject = rej; });

    this.anims.set(id, {
      id, start, duration, ease,
      onUpdate: opts.onUpdate,
      onComplete: opts.onComplete,
      resolve, reject,
      cancelled: false,
    });

    this.ensureRaf();
    return {
      id,
      promise,
      cancel: () => this.cancel(id),
    };
  }

  /** Cancel one animation (rejects its promise) */
  cancel(id: number) {
    const a = this.anims.get(id);
    if (!a) return;
    a.cancelled = true;
    this.anims.delete(id);
    a.reject(new Error("animation cancelled"));
    this.maybeStopRaf();
  }

  /** Cancel all animations (rejects their promises) */
  cancelAll() {
    for (const a of this.anims.values()) {
      a.cancelled = true;
      a.reject(new Error("animation cancelled"));
    }
    this.anims.clear();
    this.maybeStopRaf();
  }

  async sequence(steps: Array<() => { promise: Promise<void> }>) {
    for (const step of steps) {
      await step().promise;
    }
  }

  async parallel(steps: Array<() => { promise: Promise<void> }>) {
    await Promise.all(steps.map(s => s().promise));
  }

  private ensureRaf() {
    if (this.raf !== null) return;
    const tick = () => {
      const now = performance.now();
      for (const a of [...this.anims.values()]) {
        const p = a.duration === 0 ? 1 : Math.min(1, (now - a.start) / a.duration);
        const e = a.ease(p);
        try {
          a.onUpdate(e);
        } catch (err) {
          this.anims.delete(a.id);
          a.reject(err);
          continue;
        }
        if (p >= 1) {
          this.anims.delete(a.id);
          try { a.onComplete?.(); } catch {}
          a.resolve();
        }
      }
      if (this.anims.size > 0) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.raf = null;
      }
    };
    this.raf = requestAnimationFrame(tick);
  }

  private maybeStopRaf() {
    if (this.anims.size === 0 && this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }
}

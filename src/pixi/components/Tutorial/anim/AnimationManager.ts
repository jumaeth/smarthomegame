export type Ease = (t: number) => number;
export const linear: Ease = t => t;
export const easeInOutQuad: Ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

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
          a.onComplete?.();
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

  private async runOnce(
          mode: "sequence" | "parallel",
          steps: Array<() => { promise: Promise<void> }>,
          signal?: AbortSignal
  ): Promise<void> {
    if (signal?.aborted) throw new Error("loop aborted");

    if (mode === "sequence") {
      await this.sequence(steps);
    } else {
      await this.parallel(steps);
    }
  }

  /** Sleep helper that respects AbortSignal */
  private sleep(ms: number, signal?: AbortSignal): Promise<void> {
    if (!ms) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(id);
        reject(new Error("loop aborted"));
      };

      if (signal) {
        if (signal.aborted) onAbort();
        else signal.addEventListener("abort", onAbort, {once: true});
      }
    });
  }

  runUntil(
          factory: () => Array<() => { promise: Promise<void> }>,
          opts: {
            mode: "sequence" | "parallel";
            until: () => boolean | Promise<boolean>;
            delayMs?: number;
            maxIterations?: number;
            signal?: AbortSignal;
            checkAfter?: boolean;
          }
  ): { promise: Promise<void>; cancel: () => void; signal: AbortSignal } {
    const {
      mode,
      until,
      delayMs = 0,
      maxIterations = Infinity,
      signal: externalSignal,
      checkAfter = true,
    } = opts;

    // Create our own AbortController; respect an external signal if provided
    const controller = new AbortController();
    const {signal} = controller;

    const cancel = () => controller.abort();

    // If an external signal is provided, wire it up
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else {
        const onAbort = () => controller.abort();
        externalSignal.addEventListener("abort", onAbort, {once: true});
        signal.addEventListener("abort", () =>
                externalSignal.removeEventListener("abort", onAbort)
        );
      }
    }

    const promise = (async () => {
      let i = 0;

      const shouldStop = async () => Boolean(await until());

      // 1) Check before first iteration
      if (await shouldStop()) return;

      while (!signal.aborted) {
        if (i++ >= maxIterations) {
          throw new Error("runUntil: exceeded maxIterations");
        }

        // Build steps fresh each loop (so callers can vary props/targets)
        const steps = factory();

        // Run them once in chosen mode
        await this.runOnce(mode, steps, signal);

        // 2) Optional check after each iteration
        if (checkAfter && (await shouldStop())) return;

        // Optional delay between iterations
        if (delayMs) {
          await this.sleep(delayMs, signal);
        }
      }

      // If we get here due to abort:
      throw new Error("loop aborted");
    })();

    return {promise, cancel, signal};
  }
}

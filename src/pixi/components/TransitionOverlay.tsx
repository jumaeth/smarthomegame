import {useEffect, useRef, useState} from "react";
import {Graphics} from "@pixi/react";

interface Props {
  width: number;
  height: number;
  inTransition: boolean;
  onMidTransition: () => void;
  onTransitionEnd: () => void;
}

export const TransitionOverlay = ({
                                    width,
                                    height,
                                    inTransition,
                                    onMidTransition,
                                    onTransitionEnd,
                                  }: Props) => {
  const [alpha, setAlpha] = useState(0);
  const [phase, setPhase] = useState<"idle" | "fadeIn" | "hold" | "fadeOut">("idle");
  const requestRef = useRef<number>();

  useEffect(() => {
    if (inTransition) setPhase("fadeIn");
  }, [inTransition]);

  useEffect(() => {
    let last = performance.now();

    function animate(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (phase === "fadeIn") {
        setAlpha(a => {
          const next = Math.min(a + dt * 2, 1);
          if (next === 1) setPhase("hold");
          return next;
        });
      } else if (phase === "fadeOut") {
        setAlpha(a => {
          const next = Math.max(a - dt * 2, 0);
          if (next === 0) {
            setPhase("idle");
            onTransitionEnd();
          }
          return next;
        });
      }
      if (phase !== "idle") requestRef.current = requestAnimationFrame(animate);
    }

    if (phase === "fadeIn" || phase === "fadeOut") {
      requestRef.current = requestAnimationFrame(animate);
    }
    if (phase === "hold") {
      onMidTransition();
      setTimeout(() => setPhase("fadeOut"), 100); // short pause
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [phase]);

  if (phase === "idle" && !inTransition) return null;

  return (
          <Graphics
                  alpha={alpha}
                  draw={g => {
                    g.clear();
                    g.beginFill(0x000000);
                    g.drawRect(0, 0, width, height);
                    g.endFill();
                  }}
          />
  );
};
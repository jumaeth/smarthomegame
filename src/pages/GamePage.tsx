import { useEffect, useRef } from "react";
import { setupPixiApp } from "../pixi/pixiApp";

export default function GamePage() {
  const pixiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: Awaited<ReturnType<typeof setupPixiApp>>;

    (async () => {
      app = await setupPixiApp();
      if (pixiContainer.current) {
        pixiContainer.current.appendChild(app.view);
      }
    })();

    return () => {
      if (app) {
        app.destroy(true, { children: true, texture: true });
      }
    };
  }, []);

  return (
          <div className="w-full h-screen bg-black overflow-hidden">
            <div ref={pixiContainer} className="w-full h-full" />
          </div>
  );
}

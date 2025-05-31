import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment";
import {MainContainer} from "@/pixi/container/MainContainer";
import {IntroContainer} from "@/pixi/container/IntroContainer";

export const MainStage = () => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const [showIntro, setShowIntro] = useState(true);

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    }
  }, [updateCanvasSize])

  return (
    <>
      <Stage width={canvasSize.width} height={canvasSize.height}>
        {showIntro ? (
                <IntroContainer
                        canvasSize={canvasSize}
                        onStart={() => setShowIntro(false)}
                />
        ) : (
                <MainContainer canvasSize={canvasSize} />
        )}
      </Stage>
    </>
  );
}
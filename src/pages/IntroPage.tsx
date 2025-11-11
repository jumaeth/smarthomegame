import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/character/movment.ts";
import {IntroContainer} from "@/pixi/container/IntroContainer";
import {useNavigate} from "react-router-dom";

export const IntroPage = () => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const navigate = useNavigate();

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
              <IntroContainer
                      canvasSize={canvasSize}
                      onStart={() => navigate("/game/livingroom")}
              />
            </Stage>
          </>
  );
}
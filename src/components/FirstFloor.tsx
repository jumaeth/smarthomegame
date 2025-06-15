import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment";
import {MainContainer} from "@/pixi/container/MainContainer";
import {MapKey} from "@/types/maps";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps";
import {useNavigate} from "react-router-dom";

export const FirstFloor = () => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const roomName = "hallway"; //ToDo find better way to match with GameService

  const collisionMap = LEVEL_COLLISION_MAPS[roomName];
  const navigate = useNavigate();


  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  const handleMapChange = (newMap: MapKey) => {
    navigate(`/game/${newMap}`);
  };

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    }
  }, [updateCanvasSize, collisionMap])

  return (
          <>
            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={handleMapChange}
              />
            </Stage>
          </>
  );
}
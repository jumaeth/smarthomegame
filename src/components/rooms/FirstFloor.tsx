import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {useNavigate} from "react-router-dom";
import {useGameService} from "@/hooks/useGameService.tsx";

export const FirstFloor = () => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const roomName = "hallway"; //ToDo find better way to match with GameService

  const collisionMap = LEVEL_COLLISION_MAPS[roomName];
  const navigate = useNavigate();

  const gameService = useGameService();


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
                      gameService={useGameService()}
              />
            </Stage>
          </>
  );
}
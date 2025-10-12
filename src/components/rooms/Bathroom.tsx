import {useCallback, useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";

export const Bathroom = () => {
  const gameService = useGameService();
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const roomName = "bathroom";

  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  const handleMapChange = (newMap: MapKey) => {
    console.log("Map changed to:", newMap);
    return gameService.leaveRoom(roomName);
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
};
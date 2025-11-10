import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {useNavigate} from "react-router-dom";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {RoomNames} from "@/objects/RoomNames.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {InteractiveType} from "@/types/InteractiveType.ts";

export const Hallway = () => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  const roomName = RoomNames.HALLWAY;

  const collisionMap = LEVEL_COLLISION_MAPS[roomName];
  const navigate = useNavigate();

  const gameService = useGameService();

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  useEffect(() => {
    const room = gameService.getRoom(roomName)
    room?.unlockRoom();
    room?.complete();
  }, []);

  const handleMapChange = (newMap: MapKey) => {
    navigate(`/game/${newMap}`);
  };

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    }
  }, [updateCanvasSize, collisionMap])

  const interactivePixiElements = [
    new InteractivePixiElement(7.1, 2.5, 1, 1, "HallwayFrog", () => {}, InteractiveType.DUMMY),
  ];


  return (
          <>
            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={handleMapChange}
                      gameService={gameService}
                      room={roomName}
                      interactiveElements={interactivePixiElements}
              />
            </Stage>
          </>
  );
}
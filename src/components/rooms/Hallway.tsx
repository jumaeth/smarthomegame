import {Container, Stage} from "@pixi/react";
import {useCallback, useEffect, useRef, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {useNavigate} from "react-router-dom";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {RoomNames} from "@/objects/RoomNames.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {t} from "@lingui/core/macro";
import {Container as PixiContainer} from "pixi.js"
import {createSpeechBubble} from "@/utils/speechBubble.ts";
import {TILE_SIZE, ZOOM} from "@/pixi/constants/world-settings.ts";
import {InteractiveType} from "@/types/InteractiveType.ts";
import {SpeechBubbleReact} from "@/utils/speechBubble.tsx";

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


  const frog_text = t`Quaaak!`

  const interactivePixiElements = [
    new InteractivePixiElement(7.1, 2.5, 1, 1, "Frog", () => {
      return(
              <SpeechBubbleReact
                      x={7.1 * TILE_SIZE}
                      y={2.5 * TILE_SIZE}
                      text={frog_text}
                      color={0x2c2b33}
                      textColor={0xffffff}
              />
      );
    }, InteractiveType.DUMMY),
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
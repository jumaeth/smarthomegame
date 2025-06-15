import {useCallback, useEffect,  useState} from "react";
import {useGameService} from "@/hooks/useGameService";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";

export const Kitchen = () => {
  // const smartTvModalRef = useRef<{ closeModal: () => void }>(null);
  // const smartLightsModalRef = useRef<{ closeModal: () => void }>(null);
  const roomName = "kitchen"; //ToDo find better way to match with GameService

  const gameService = useGameService();
  // const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);


  // const checkForCompletion = () => {
  //   console.log("Not implemented yet");
  // };

  //Render Code
  //ToDo check to remove duplicated code in other rooms
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])


  function handleMapChange(newMap: MapKey): boolean {
    //Todo remove
    console.log("Map changed to:", newMap);
    return gameService.leaveRoom(roomName);
  }

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
};
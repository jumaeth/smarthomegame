import {useCallback, useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService";
import {calculateCanvasSize} from "@/utils/character/movment";
import {MapKey} from "@/types/maps";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer";
import {RoomNames} from "@/objects/RoomNames";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {InteractiveType} from "@/types/InteractiveType";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState";
import {SmartDevice} from "@/objects/SmartDevice";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper";

export const Bathroom = () => {
  const gameService = useGameService();
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const roomName = RoomNames.BATHROOM;
  const smartDevices: SmartDevice[] = gameService.getDeviceForRoom(roomName);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const sdEnabled = useSmarDevicesEnabledState();

  function onModalClose() {
    setActiveDevice(null);
    gameService.resumeGame();
  }

  const interactiveElements = [
    new InteractivePixiElement(11, 2, 2, 2, "SmartMirror", (): void => {}),
    new InteractivePixiElement(1, 3, 2, 1, "SmartShower", (): void => {}),
    new InteractivePixiElement(14.975, 6.5, 1, 1, "BathroomChick", () => {}, InteractiveType.DUMMY),
    new InteractivePixiElement(1.15, 6.5, 1.6, 1, "BathroomDrawer", () => {}, InteractiveType.DUMMY),
  ];

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

  const deviceComponents: Record<string, JSX.Element> = {
    //SmartShower: <SmartShower completeDevice={() => smartDeviceCallback(true)}/>,
  };


  return (
          <>
            <div>
              <BasicModalWrapper
                      isOpen={!!activeDevice}
                      content={activeDevice ? deviceComponents[activeDevice] : null}
                      onClose={onModalClose}
                      showBg={sdEnabled}
                      activeDevice={smartDevices.find((d) => d.name === activeDevice) ?? smartDevices[0] ?? new SmartDevice("SmartShower", "")}
              />
            </div>

            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={handleMapChange}
                      gameService={useGameService()}
                      interactiveElements={interactiveElements}
                      room={roomName}
              />
            </Stage>
          </>
  );
};
import {useCallback, useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";

import {SmartTv} from "../smart-devices/SmartTv.tsx";
import {SmartLights} from "../smart-devices/SmartLights.tsx";

import {calculateCanvasSize} from "@/utils/character/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper.tsx";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState.ts";
import {usePauseState} from "@/hooks/gameService/usePauseState.ts";
import {useTutorialActive} from "@/hooks/gameService/useTutorialActive.ts";
import {RoomNames} from "@/objects/RoomNames.ts";
import {InteractiveType} from "@/types/InteractiveType.ts";

export const LivingRoom = () => {
  const roomName: RoomNames = RoomNames.LIVINGROOM;

  const gameService = useGameService();
  const smartDevices: SmartDevice[] = gameService.getDeviceForRoom(roomName);

  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const tutorialActive = useTutorialActive();
  const sdEnabled = useSmarDevicesEnabledState();
  const paused = usePauseState();

  const smartDeviceCallback = (isCompleted: boolean): void => {
    if (!activeDevice) return;
    const device = smartDevices.find((d) => d.name === activeDevice);
    if (!device) return;
    if (isCompleted) gameService.completeDevice(device.name);
    gameService.resumeGame();
    setActiveDevice(null);
    checkForRoomCompletion();
  }

  const handleDeviceOpen = (deviceName: string): void => {
    if (tutorialActive.enabled && (deviceName !== "SmartTv")) return;
    setActiveDevice(deviceName);
    gameService.pauseGame();
  };

  const checkForRoomCompletion = () => {
    const allCompleted = smartDevices.every(device => device.getIsCompleted());
    if (allCompleted) {
      gameService.completeRoom(roomName);
    }
  };

  function onModalClose() {
    setActiveDevice(null);
    gameService.resumeGame();
  }

  const interactiveElements = [
    new InteractivePixiElement(4, 2, 2, 1, "SmartTv", (): void => handleDeviceOpen("SmartTv")),
    new InteractivePixiElement(1, 2, 1, 2, "SmartLights", (): void => handleDeviceOpen("SmartLights")),
    new InteractivePixiElement(8.95, 5.225, 1, 1, "LivingRoomCandles", () => {}, InteractiveType.DUMMY),
    new InteractivePixiElement(16, 5, 1, 1, "LivingRoomFood", () => {}, InteractiveType.DUMMY),
  ]

  //Render Code
  //ToDo check to remove duplicated code in other rooms
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  function handleMapChange(newMap: MapKey): boolean {
    if (tutorialActive.enabled) return false;
    console.log(newMap); //ToDo remove
    return gameService.leaveRoom(roomName);
  }

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    }
  }, [updateCanvasSize, collisionMap]);

  const deviceComponents: Record<string, JSX.Element> = {
    SmartTv: <SmartTv onCompletion={(completed) => smartDeviceCallback(completed)}/>,
    SmartLights: <SmartLights onCompletion={(completed) => smartDeviceCallback(completed)}/>,
  };

  return (
          <>
            <div>
              <BasicModalWrapper
                      isOpen={!!activeDevice}
                      content={activeDevice ? deviceComponents[activeDevice] : null}
                      onClose={onModalClose}
                      showBg={sdEnabled}
                      activeDevice={smartDevices.find((d) => d.name === activeDevice) ?? smartDevices[0]}
              />
            </div>
            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={handleMapChange}
                      interactiveElements={interactiveElements}
                      isPaused={paused}
                      gameService={gameService}
                      room={roomName}
              />
            </Stage>
          </>
  );
};
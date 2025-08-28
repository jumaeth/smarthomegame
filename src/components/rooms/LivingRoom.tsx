import {useCallback, useEffect, useRef, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {RoomName} from "@/objects/Room.ts";

import {SmartTv} from "../smart-devices/SmartTv.tsx";
import {SmartLights} from "../smart-devices/SmartLights.tsx";

import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper.tsx";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState.ts";
import {usePauseState} from "@/hooks/gameService/usePauseState.ts";

export const LivingRoom = () => {
  const roomName: RoomName = "livingroom"
  const [isPaused, setIsPaused] = useState(false);

  const gameService = useGameService();
  const smartDevices : SmartDevice[] = gameService.getDeviceForRoom(roomName);

  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [tutorialEnabled, setTutorialEnabled] = useState(true);
  const sdEnabled = useSmarDevicesEnabledState();
  const paused = usePauseState();

  const smartDeviceCallback = (isCompleted:boolean):void => {
    if (!activeDevice) return;
    const device = smartDevices.find((d) => d.name === activeDevice);
    if (!device) return;
    if (isCompleted) device.complete();
    gameService.resumeGame();
    //setIsPaused(false);
    setActiveDevice(null);
    checkForRoomCompletion();
  }

  const handleDeviceOpen = (deviceName: string):void => {
    setActiveDevice(deviceName);
    gameService.pauseGame();
    //setIsPaused(true);
  };

  const checkForRoomCompletion = () => {
    const allCompleted = smartDevices.every(device  => device.getIsCompleted());
    if (allCompleted) {
      gameService.completeRoom(roomName);
    }
  };

  function onModalClose() {
    if (gameService.isPaused())return;
    setActiveDevice(null);
    gameService.resumeGame();
    //setIsPaused(false);
  }

  const interactiveElements = [
    new InteractivePixiElement(4, 2, 2, 1, ():void => handleDeviceOpen("SmartTv")),
    new InteractivePixiElement(1, 2, 1, 1, ():void => handleDeviceOpen("SmartLights"))
  ]

  //Render Code
  //ToDo check to remove duplicated code in other rooms
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  function handleMapChange(newMap: MapKey): boolean {
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
    SmartTv: <SmartTv onCompletion={(completed) => smartDeviceCallback(completed)} />,
    SmartLights: <SmartLights onCompletion={(completed) => smartDeviceCallback(completed)} />,
  };

  return (
          <>
            <div>
              <BasicModalWrapper
                      isOpen={!!activeDevice}
                      content={activeDevice ? deviceComponents[activeDevice] : null}
                      onClose={onModalClose}
                      showBg={sdEnabled}

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
                      tutorialEnabled={tutorialEnabled}
                      finishTutorial={() => setTutorialEnabled(false)}
              />
            </Stage>
          </>
  );
};
import {useCallback, useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService";
import {SmartDevice} from "@/objects/SmartDevice";
import {SmartShower} from "../smart-devices/SmartShower";
import {calculateCanvasSize} from "@/utils/character/movment";
import {MapKey} from "@/types/maps";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState";
import {usePauseState} from "@/hooks/gameService/usePauseState";
import {RoomNames} from "@/objects/RoomNames";

export const Bathroom = () => {
  const gameService = useGameService();
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const roomName = RoomNames.BATHROOM;
  const smartDevices: SmartDevice[] = gameService.getDeviceForRoom(roomName);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
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
  };

  const handleDeviceOpen = (deviceName: string): void => {
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
    new InteractivePixiElement(1, 3, 2, 1, "SmartShower", (): void => handleDeviceOpen("SmartShower")),
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
    SmartShower: <SmartShower completeDevice={() => smartDeviceCallback(true)}/>,
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
                      interactiveElements={interactiveElements}
                      isPaused={paused}
                      gameService={gameService}
                      room={roomName}
              />
            </Stage>
          </>
  );
};
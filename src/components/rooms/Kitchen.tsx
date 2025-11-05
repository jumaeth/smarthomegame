import {useCallback, useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper.tsx";
import {SmartHomeHub} from "@/components/smart-devices/SmartHomeHub.tsx";
import {SmartKitchen} from "@/components/smart-devices/SmartKitchen.tsx";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera.tsx";
import {RoomNames} from "@/objects/RoomNames.ts";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState.ts";
import {usePauseState} from "@/hooks/gameService/usePauseState.ts";

export const Kitchen = () => {
    const gameService = useGameService();
    const roomName = RoomNames.KITCHEN
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

  const checkForRoomCompletion = (): void => {
    const allCompleted = smartDevices.every((device) => device.getIsCompleted());
    if (allCompleted) {
      gameService.completeRoom(roomName);
    }
  };

  function onModalClose(): void {
    setActiveDevice(null);
    gameService.resumeGame();
  }

  const interactiveElements = [
    new InteractivePixiElement(14, 4, 1, 1, "SmartHomeHub", (): void => handleDeviceOpen("SmartHomeHub")),
    new InteractivePixiElement(1, 2, 1, 1, "SecurityCamera", (): void => handleDeviceOpen("SecurityCamera")),
    new InteractivePixiElement(9, 3, 1, 1, "SmartKitchen", (): void => handleDeviceOpen("SmartKitchen")),
  ];

  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  function handleMapChange(newMap: MapKey): boolean {
    console.log("Map changed to:", newMap);
    return gameService.leaveRoom(roomName);
  }

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [updateCanvasSize, collisionMap]);

  const deviceComponents: Record<string, JSX.Element> = {
    SmartHomeHub: <SmartHomeHub completeDevice={() => smartDeviceCallback(true)}/>,
    SmartKitchen: <SmartKitchen completeDevice={() => smartDeviceCallback(true)}/>,
    SecurityCamera: <SecurityCamera completeDevice={() => smartDeviceCallback(true)}/>,
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

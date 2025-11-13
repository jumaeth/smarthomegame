import React, {useCallback, useEffect, useState} from "react";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer";
import {BasicModalWrapper} from "@/components/general-ui/BasicModalWrapper";
import {calculateCanvasSize} from "@/utils/character/movment";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {useGameService} from "@/hooks/gameService/useGameService";
import {useSmarDevicesEnabledState} from "@/hooks/gameService/useSmarDevicesEnabledState";
import {usePauseState} from "@/hooks/gameService/usePauseState";
import {useTutorialActive} from "@/hooks/gameService/useTutorialActive";
import {RoomNames} from "@/objects/RoomNames";
import {MapKey} from "@/types/maps";
import {SmartDevice} from "@/objects/SmartDevice";
import {InteractiveType} from "@/types/InteractiveType.ts";

interface RoomWrapperProps {
  roomName: RoomNames;
  interactiveElements: InteractivePixiElement[];
  deviceComponents?: Record<string, JSX.Element>;
  autoComplete?: boolean; // for simple rooms like Hallway
  autoUnlock?: boolean;
  onMapChangeOverride?: (newMap: MapKey) => boolean | void;
}

export const RoomWrapper = ({
                              roomName,
                              interactiveElements,
                              deviceComponents,
                              autoComplete,
                              autoUnlock,
                              onMapChangeOverride
                            }: RoomWrapperProps) => {
  const gameService = useGameService();
  const smartDevices: SmartDevice[] = gameService.getDeviceForRoom(roomName);

  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const tutorialActive = useTutorialActive();
  const sdEnabled = useSmarDevicesEnabledState();
  const paused = usePauseState();
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const collisionMap = LEVEL_COLLISION_MAPS[roomName];

  const handleDeviceOpen = (deviceName: string): void => {
    if (gameService.getDeviceByName(deviceName).getIsCompleted()) return;
    if (tutorialActive.enabled && (deviceName !== "SmartTv")) return;
    setActiveDevice(deviceName);
    gameService.pauseGame();
  };

  const handleDeviceClose = (): void => {
    gameService.resumeGame();
    setActiveDevice(null);
  };

  const smartDeviceCallback = (completed: boolean): void => {
    if (!activeDevice) return;
    const device = smartDevices.find((d) => d.name === activeDevice);
    if (!device) return;

    if (completed) gameService.completeDevice(device.name);
    gameService.resumeGame();
    setActiveDevice(null);
    checkForRoomCompletion();
  };

  const checkForRoomCompletion = () => {
    const allCompleted = smartDevices.every((device) => device.getIsCompleted());
    if (allCompleted) {
      gameService.completeRoom(roomName);
    }
  };

  const processedElements = interactiveElements.map((el) => {
    if (el.type === InteractiveType.SMART_DEVICE) {
      return {...el, onInteract: () => handleDeviceOpen(el.name)};
    }
    return el;
  });


  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    if (autoUnlock) gameService.getRoom(roomName)?.unlockRoom();
    if (autoComplete) gameService.getRoom(roomName)?.complete();
  }, [autoUnlock, autoComplete]);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [updateCanvasSize]);

  const handleMapChange = (): boolean => {
    if (tutorialActive.enabled) return false;
    return gameService.leaveRoom(roomName);
  };

  return (
          <>
            <BasicModalWrapper
                    isOpen={!!activeDevice}
                    content={
                      activeDevice && deviceComponents
                              ? React.cloneElement(deviceComponents[activeDevice], {
                                onCompletion: smartDeviceCallback,
                                completeDevice: smartDeviceCallback,
                              })
                              : null
                    }
                    onClose={handleDeviceClose}
                    showBg={sdEnabled}
                    activeDevice={smartDevices.find((d) => d.name === activeDevice) ?? smartDevices[0]}
            />

            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={onMapChangeOverride ?? handleMapChange}
                      interactiveElements={processedElements}
                      isPaused={paused}
                      gameService={gameService}
                      room={roomName}
                      onDeviceOpen={handleDeviceOpen}
              />
            </Stage>
          </>
  );
};

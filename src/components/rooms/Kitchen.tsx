import {useCallback, useEffect, useRef, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent.tsx";
import {SmartHomeHub} from "@/components/smart-devices/SmartHomeHub.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {SmartKitchen} from "@/components/smart-devices/SmartKitchen.tsx";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera.tsx";

export const Kitchen = () => {
    const gameService = useGameService();
    const roomName = "kitchen"; //ToDo find better way to match with GameService
    const [isPaused, setIsPaused] = useState(false);

    const smartHomeHubModalRef = useRef<{ toggleModal: () => void } | null>(null);
  const smartKitchenModalRef = useRef<{ toggleModal: () => void } | null>(null);
  const securityCameraModalRef = useRef<{ toggleModal: () => void } | null>(null);

  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);

    const smartHomeHubCallback = () => {
        gameService.completeDevice("SmartHomeHub");
        setIsPaused(false);
        smartHomeHubModalRef.current?.toggleModal();
    };

    const openSmartHomeHub = () => {
        if (smartHomeHubModalRef.current) {
            setIsPaused(true)
            smartHomeHubModalRef.current?.toggleModal();
        }
    }

  const securityCameraCallback = () => {
    gameService.completeDevice("SecurityCamera");
    setIsPaused(false);
    securityCameraModalRef.current?.toggleModal();
  };

  const openSecurityCameraHomeHub = () => {
    if (securityCameraModalRef.current) {
      setIsPaused(true)
      securityCameraModalRef.current?.toggleModal();
    }
  }

  const smartKitchenCallback = () => {
    gameService.completeDevice("SmartKitchen");
    setIsPaused(false);
    smartKitchenModalRef.current?.toggleModal();
  };

  const openSmartKitchen = () => {
    if (smartKitchenModalRef.current) {
      setIsPaused(true);
      smartKitchenModalRef.current?.toggleModal();
    }
  };

  const interactiveElements = [
    new InteractivePixiElement(14, 4, 1, 1, "SmartHomeHub", openSmartHomeHub),
    new InteractivePixiElement(1, 2, 1, 1, "SecurityCamera", openSecurityCameraHomeHub),
    new InteractivePixiElement(9, 3, 1, 1, "SmartKitchen", openSmartKitchen)
  ]

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

    function onModalClose() {
        setIsPaused(false);
    }

    useEffect(() => {
        window.addEventListener("resize", updateCanvasSize);
        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        }
    }, [updateCanvasSize, collisionMap])

    return (
        <>
            <div>
              {devices.includes("SmartHomeHub") && (
                      <ModalWrapperComponent
                              ref={smartHomeHubModalRef}
                              content={<SmartHomeHub completeDevice={smartHomeHubCallback}/>}
                              onClose={onModalClose}
                      />
              )}
              {devices.includes("SmartKitchen") && (
                      <ModalWrapperComponent
                              ref={smartKitchenModalRef}
                              content={<SmartKitchen completeDevice={smartKitchenCallback} />}
                              onClose={onModalClose}
                      />
              )}
              {devices.includes("SecurityCamera") && (
                      <ModalWrapperComponent
                              ref={securityCameraModalRef}
                              content={<SecurityCamera completeDevice={securityCameraCallback}/>}
                              onClose={onModalClose}
                      />
              )}
            </div>
            <Stage width={canvasSize.width} height={canvasSize.height}>
              <MainContainer
                      canvasSize={canvasSize}
                      map={roomName}
                      collisionMap={collisionMap}
                      onMapChange={handleMapChange}
                      interactiveElements={interactiveElements}
                      isPaused={isPaused}
                      gameService={gameService}
                      room={roomName}
              />
            </Stage>
        </>
    );
};
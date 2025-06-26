import {useCallback, useEffect, useRef, useState} from "react";
import {useGameService} from "@/hooks/useGameService";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent.tsx";
import {SmartHomeHub} from "@/components/smart-devices/SmartHomeHub.tsx";
import { SmartDevice } from "@/objects/SmartDevice";
import {SmartKitchen} from "@/components/smart-devices/SmartKitchen.tsx";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera.tsx";

export const Kitchen = () => {
    const gameService = useGameService();
    const roomName = "kitchen"; //ToDo find better way to match with GameService
    const [isPaused, setIsPaused] = useState(false);

    const smartHomeHubModalRef = useRef<{ toggleModal: () => void }>(null);
  const smartKitchenModalRef = useRef<{ toggleModal: () => void }>(null);
  const securityCameraModalRef = useRef<{ toggleModal: () => void }>(null);

  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);
    const [isSmartHomeHubCompleted, setSmartHomeHubCompleted] = useState(false);
  const [isSmartKitchenCompleted, setSmartKitchenCompleted] = useState(false);
  const [isSecurityCameraCompleted, setSecurityCameraCompleted] = useState(false);


  const checkForCompletion = () => {
    if ((!devices.includes("SmartHomeHub") || isSmartHomeHubCompleted) && (!devices.includes("SecurityCamera") || isSecurityCameraCompleted) && (!devices.includes("SmartKitchen") || isSmartKitchenCompleted)) {
      console.log("Kitchen erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Kitchen nicht bestanden.");
    }
  };

    const smartHomeHubCallback = (isCompleted: boolean) => {
        setSmartHomeHubCompleted(isCompleted);
        setIsPaused(false);
        smartHomeHubModalRef.current?.toggleModal();
        checkForCompletion();
    };

    const openSmartHomeHub = () => {
        if (smartHomeHubModalRef.current) {
            setIsPaused(true)
            smartHomeHubModalRef.current.toggleModal();
        }
    }

  const securityCameraCallback = (isCompleted: boolean) => {
    setSecurityCameraCompleted(isCompleted);
    setIsPaused(false);
    securityCameraModalRef.current?.toggleModal();
    checkForCompletion();
  };

  const openSecurityCameraHomeHub = () => {
    if (securityCameraModalRef.current) {
      setIsPaused(true)
      securityCameraModalRef.current.toggleModal();
    }
  }

  const smartKitchenCallback = (isCompleted: boolean) => {
    console.log("smartKitchenCallback");
    setSmartKitchenCompleted(isCompleted);
    setIsPaused(false);
    smartKitchenModalRef.current?.toggleModal();
    checkForCompletion();
  };

  const openSmartKitchen = () => {
    console.log("openSmartKitchen");
    if (smartKitchenModalRef.current) {
      setIsPaused(true);
      smartKitchenModalRef.current.toggleModal();
    }
  };

  const interactiveElements = [
    new InteractivePixiElement(10, 4, 1, 1, openSmartHomeHub),
    new InteractivePixiElement(1, 2, 1, 1, openSecurityCameraHomeHub),
    new InteractivePixiElement(10, 3, 1, 1, openSmartKitchen)
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
                              content={<SmartHomeHub onCompletion={smartHomeHubCallback}/>}
                              onClose={onModalClose}
                      />
              )}
              {devices.includes("SmartKitchen") && (
                      <ModalWrapperComponent
                              ref={smartKitchenModalRef}
                              content={<SmartKitchen onCompletion={smartKitchenCallback} />}
                              onClose={onModalClose}
                      />
              )}
              {devices.includes("SecurityCamera") && (
                      <ModalWrapperComponent
                              ref={securityCameraModalRef}
                              content={<SecurityCamera onCompletion={securityCameraCallback}/>}
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
                />
            </Stage>
        </>
    );
};
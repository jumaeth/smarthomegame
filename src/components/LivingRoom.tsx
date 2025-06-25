import {useCallback, useEffect, useRef, useState} from "react";
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {SmartDevice} from "@/objects/SmartDevice";
import {useGameService} from "@/hooks/useGameService";
import {calculateCanvasSize} from "@/utils/movment.ts";
import {MapKey} from "@/types/maps.ts";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps.ts";
import {Stage} from "@pixi/react";
import {MainContainer} from "@/pixi/container/MainContainer.tsx";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent.tsx";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";

export const LivingRoom = () => {
  const smartTvModalRef = useRef<{ toggleModal: () => void }>(null);
  const smartLightsModalRef = useRef<{ toggleModal: () => void }>(null);
  const roomName = "livingroom"; //ToDo find better way to match with GameService
  const [isPaused, setIsPaused] = useState(false);

  const gameService = useGameService();
  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);

  const [isSmartTvCompleted, setIsSmartTvCompleted] = useState(false);
  const [isSmartLightsCompleted, setIsSmartLightsCompleted] = useState(false);

  const smartTvCallback = (isCompleted: boolean) => {
    setIsSmartTvCompleted(isCompleted);
    setIsPaused(false);
    smartTvModalRef.current?.toggleModal();
    checkForCompletion();
  };

  const openSmartTvModal = () => {
    if (smartTvModalRef.current) {
      setIsPaused(true)
      smartTvModalRef.current.toggleModal();
    }
  }

  const smartLightsCallback = (isCompleted: boolean) => {
    setIsSmartLightsCompleted(isCompleted);
    setIsPaused(false);
    smartLightsModalRef.current?.toggleModal();
    checkForCompletion();
  };

  const openSmartLightsModal = () => {
    if (smartLightsModalRef.current) {
      setIsPaused(true)
      smartLightsModalRef.current.toggleModal();
    }
  }

  const checkForCompletion = () => {
    if ((!devices.includes("SmartTv") || isSmartTvCompleted) && (!devices.includes("SmartLights") || isSmartLightsCompleted)) {
      console.log("Living Room erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Living Room nicht bestanden.");
    }
  };

  function onModalClose() {
    setIsPaused(false);
  }

  const interactiveElements = [
    new InteractivePixiElement(4, 2, 2, 1, openSmartTvModal),
    new InteractivePixiElement(1, 2, 1, 1, openSmartLightsModal)
    //new InteractivePixiElement(12, 2, 1, 1, TODO)
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
  }, [updateCanvasSize, collisionMap])

  return (
          <>
            <div>
              {devices.includes("SmartTv") && (
                      <ModalWrapperComponent
                              ref={smartTvModalRef}
                              content={<SmartTv onCompletion={smartTvCallback}/>}
                              onClose={onModalClose}
                      />
              )}
              {devices.includes("SmartLights") && (
                      <ModalWrapperComponent
                              ref={smartLightsModalRef}
                              content={<SmartLights onCompletion={smartLightsCallback}/>}
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
import {useRef} from "react";
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";
import {SmartDevice} from "../objects/SmartDevice.ts";
import {useGameService} from "../hooks/useGameService.tsx";

export const LivingRoom = () => {
  const smartTvModalRef = useRef<{ closeModal: () => void } | null>(null);
  const smartLightsModalRef = useRef<{ closeModal: () => void } | null>(null);
  const roomName = "Living Room"; //ToDo find better way to match with GameService

  const gameService = useGameService();
  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);

  let isSmartTvCompleted: boolean = false;
  let isSmartLightsCompleted: boolean = false;

  const smartTvCallback = (isCompleted: boolean) => {
    isSmartTvCompleted = isCompleted;
    smartTvModalRef.current?.closeModal();
    checkForCompletion();
  };

  const smartLightsCallback = (isCompleted: boolean) => {
    isSmartLightsCompleted = isCompleted;
    smartLightsModalRef.current?.closeModal();
    checkForCompletion();
  };

  const checkForCompletion = () => {
    if ((!devices.includes("SmartTv") || isSmartTvCompleted) && (!devices.includes("SmartLights") || isSmartLightsCompleted)) {
      console.log("Living Room erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Living Room nicht bestanden.");
    }
  };

  return (
          <div>
            <h1>LivingRoom</h1>
            {devices.includes("SmartTv") && (
                    <ModalWrapperComponent
                            ref={smartTvModalRef}
                            content={<SmartTv onCompletion={smartTvCallback}/>}
                            openButton="Smart TV öffnen"
                    />
            )}
            {devices.includes("SmartLights") && (
                    <ModalWrapperComponent
                            ref={smartLightsModalRef}
                            content={<SmartLights onCompletion={smartLightsCallback}/>}
                            openButton="Smart Lights öffnen"
                    />
            )}
          </div>
  );
};
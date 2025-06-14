import {useRef} from "react";
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";
import {SmartDevice} from "@/objects/SmartDevice";
import {useGameService} from "@/hooks/useGameService";
import SmartHomeHub from "./smart-devices/SmartHomeHub";

export const LivingRoom = () => {
  const smartTvModalRef = useRef<{ closeModal: () => void }>(null);
  const smartLightsModalRef = useRef<{ closeModal: () => void }>(null);
  const smartHomeHubModalRef = useRef<{ closeModal: () => void }>(null);
  const roomName = "Living Room"; //ToDo find better way to match with GameService

  const gameService = useGameService();
  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);

  let isSmartTvCompleted: boolean = false;
  let isSmartLightsCompleted: boolean = false;
  let isSmartHomeHubCompleted: boolean = false;

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

  const smartHomeHubCallback = (isCompleted: boolean) => {
    isSmartHomeHubCompleted = isCompleted;
    smartHomeHubModalRef.current?.closeModal();
    checkForCompletion();
  };

  const checkForCompletion = () => {
    if ((!devices.includes("SmartTv") || isSmartTvCompleted) && 
        (!devices.includes("SmartLights") || isSmartLightsCompleted) &&
        (!devices.includes("SmartHomeHub") || isSmartHomeHubCompleted)) {
      console.log("Living Room erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Living Room nicht bestanden.");
    }
  };

  return (
          <div>
            {devices.includes("SmartTv") && (
                    <ModalWrapperComponent
                            ref={smartTvModalRef}
                            content={<SmartTv onCompletion={smartTvCallback}/>}
                            openButton={<button>Smart TV öffnen</button>}
                    />
            )}
            {devices.includes("SmartLights") && (
                    <ModalWrapperComponent
                            ref={smartLightsModalRef}
                            content={<SmartLights onCompletion={smartLightsCallback}/>}
                            openButton={<button>Smart Lights öffnen</button>}
                    />
            )}
            {devices.includes("SmartHomeHub") && (
                    <ModalWrapperComponent
                            ref={smartHomeHubModalRef}
                            content={<SmartHomeHub onCompletion={smartHomeHubCallback}/>}
                            openButton={<button>Smart Home Hub öffnen</button>}
                    />
            )}
          </div>
  );
};
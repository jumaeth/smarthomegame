import {useRef} from "react";
import {SmartKitchen} from "./smart-devices/SmartKitchen.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";
import {SmartDevice} from "../objects/SmartDevice.ts";
import {useGameService} from "../hooks/useGameService.tsx";

export const Kitchen = () => {
  const smartKitchenRef = useRef<{ closeModal: () => void }>(null);
  const roomName = "Kitchen"; //ToDo find better way to match with GameService

  const gameService = useGameService();
  const devices = gameService.getDeviceForRoom(roomName).map((device: SmartDevice) => device.name);

  let isSmartKitchenCompleted: boolean = false;

  const smartKitchenCallback = (isCompleted: boolean) => {
    isSmartKitchenCompleted = isCompleted;
    smartKitchenRef.current?.closeModal();
    checkForCompletion();
  };

  const checkForCompletion = () => {
    if ((!devices.includes("SmartKitchen") || isSmartKitchenCompleted)) {
      console.log("Kitchen erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Kitchen nicht bestanden.");
    }
  };

  return (
          <div>
            <h1>Kitchen</h1>
            {devices.includes("SmartKitchen") && (
                    <ModalWrapperComponent
                            ref={smartKitchenRef}
                            content={<SmartKitchen onCompletion={smartKitchenCallback}/>}
                            openButton={<button>Smart Kitchen öffnen</button>}
                    />
            )}
          </div>
  );
};
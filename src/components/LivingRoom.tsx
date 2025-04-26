import {useRef} from "react";
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";
import {useGameService} from "../context/GameContext.tsx";

export const LivingRoom = () => {
  const smartTvModalRef = useRef<{ closeModal: () => void }>(null);
  const smartLightsModalRef = useRef<{ closeModal: () => void }>(null);
  const roomName = "Living Room"; //ToDo find better way to match with GameService

  let isSmartTvCompleted: boolean = false;
  let isSmartLightsCompleted: boolean = false;
  const gameService = useGameService();

  const smartTvCallback = (isCompleted: boolean) => {
    isSmartTvCompleted = isCompleted;
    smartTvModalRef.current?.closeModal(); // Modal schließen
    checkForCompletion();
  };

  const smartLightsCallback = (isCompleted: boolean) => {
    isSmartLightsCompleted = isCompleted;
    smartLightsModalRef.current?.closeModal(); // Modal schließen
    checkForCompletion();
  };

  const checkForCompletion = () => {
    if (isSmartTvCompleted && isSmartLightsCompleted) {
      console.log("Living Room erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName);
    } else {
      console.log("Living Room nicht bestanden.");
    }
  };

  return (
          <div>
            <h1>LivingRoom</h1>
            <ModalWrapperComponent
                    ref={smartTvModalRef}
                    content={<SmartTv onCompletion={smartTvCallback}/>}
                    openButton={<button>Smart TV öffnen</button>}
            />
            <ModalWrapperComponent
                    ref={smartLightsModalRef}
                    content={<SmartLights onCompletion={smartLightsCallback}/>}
                    openButton={<button>Smart Lights öffnen</button>}
            />
          </div>
  );
};
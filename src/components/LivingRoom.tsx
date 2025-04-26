import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";
import {useGameService} from "../context/GameContext.tsx";

export const LivingRoom = ({roomName}: { roomName: string }) => {
  let isSmartTvCompleted: boolean = false;
  let isSmartLightsCompleted: boolean = false;
  const gameService = useGameService();

  const smartTvCallback = (isCompleted: boolean) => {
    isSmartTvCompleted = isCompleted;
    checkForCompletion();
  };

  const smartLightsCallback = (isCompleted: boolean) => {
    isSmartLightsCompleted = isCompleted;
    checkForCompletion();
  };

  const checkForCompletion = () => {
    if (isSmartTvCompleted && isSmartLightsCompleted) {
      console.log("Living Room erfolgreich abgeschlossen!");
      gameService.completeRoom(roomName)
    } else {
      console.log("Living Room nicht bestanden.");
    }
  }
  return (
          <div>
            <h1>
              LivingRoom
            </h1>
            <ModalWrapperComponent
                    content={<SmartTv
                            onCompletion={smartTvCallback}
                    />}
                    openButton={<button>Smart TV öffnen</button>}
            />
            <ModalWrapperComponent
                    content={<SmartLights
                            onCompletion={smartLightsCallback}/>}
                    openButton={<button>Smart Lights öffnen</button>}
            />
          </div>
  );
};
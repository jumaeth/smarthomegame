import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";

export const LivingRoom = () => {
  const smartTvCallback = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("Smart Tv erfolgreich");
    } else {
      console.log("Smart Tv nicht bestanden.");
    }
  };
  const smartLightsCallback = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("SmartLights erfolgreich");
    } else {
      console.log("SmartLights nicht bestanden.");
    }
  };
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
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";
import {ModalWrapperComponent} from "./ModalWrapperComponent.tsx";

export const LivingRoom = () => {
  return (
          <div>
            <h1>
              LivingRoom
            </h1>
            <ModalWrapperComponent
                    content={<SmartTv/>}
                    openButton={<button>Smart TV öffnen</button>}
            />
            <ModalWrapperComponent
                    content={<SmartLights/>}
                    openButton={<button>Smart Lights öffnen</button>}
            />
          </div>
  );
};
import {SmartTv} from "./smart-devices/SmartTv.tsx";
import {SmartLights} from "./smart-devices/SmartLights.tsx";

export const LivingRoom = () => {
  return (
          <div>
            <h1>
              LivingRoom
            </h1>
            {<SmartTv/>}
            {<SmartLights/>}
          </div>
  );
};
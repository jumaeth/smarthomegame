import {useState} from "react";
import {MainStage} from "@/pixi/stages/MainStage";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent";
import {DeviceKey} from "@/types/maps";
import {SmartLights} from "@/components/smart-devices/SmartLights";

function App() {
  const [showSmartDeviceOverlay, setShowSmartDeviceOverlay] = useState<DeviceKey | false>(false);

  const securityCameraCallback = (): void => {
    setShowSmartDeviceOverlay(false);
  };

  const smartLightsCallback = (): void => {
    setShowSmartDeviceOverlay(false);
  };

  return (
          <div>
            <div>
              <MainStage triggerOverlay={(device: DeviceKey) => setShowSmartDeviceOverlay(device)}/>
            </div>

            <ModalWrapperComponent
                    content={<SecurityCamera onCompletion={securityCameraCallback}/>}
                    isOpen={showSmartDeviceOverlay === "securitycamera"}
                    setIsOpen={(open) => setShowSmartDeviceOverlay(open ? "securitycamera" : false)}
            />

            <ModalWrapperComponent
                    content={<SmartLights onCompletion={smartLightsCallback}/>}
                    isOpen={showSmartDeviceOverlay === "smartlights"}
                    setIsOpen={(open) => setShowSmartDeviceOverlay(open ? "smartlights" : false)}
            />

          </div>
  );
}

export default App;
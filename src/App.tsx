import {useRef, useState} from "react";
import {MainStage} from "@/pixi/stages/MainStage";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent";
import {Trans} from "@lingui/react/macro";
import {DeviceKey} from "@/types/maps";
import {SmartLights} from "@/components/smart-devices/SmartLights";

function App() {
  const [showSmartDeviceOverlay, setShowSmartDeviceOverlay] = useState<DeviceKey | false>(false);

  const securityCameraModalRef = useRef<{ closeModal: () => void }>(null);
  const securityCameraCallback = (): void => {
    setShowSmartDeviceOverlay(false);
    securityCameraModalRef.current?.closeModal();
  };

  const smartLightsModalRef = useRef<{ closeModal: () => void }>(null);
  const smartLightsCallback = (): void => {
    setShowSmartDeviceOverlay(false);
    smartLightsModalRef.current?.closeModal();
  };

  return (
          <div>
            <div className={showSmartDeviceOverlay ? "hidden" : "block"}>
              <MainStage triggerOverlay={(device: DeviceKey) => setShowSmartDeviceOverlay(device)} />
            </div>

            {showSmartDeviceOverlay === "securitycamera" && (
                    <ModalWrapperComponent
                            ref={securityCameraModalRef}
                            content={<SecurityCamera onCompletion={securityCameraCallback} />}
                            openButton={<button><Trans>Überwachungskamera öffnen</Trans></button>}
                    />
            )}

            {showSmartDeviceOverlay === "smartlights" && (
                    <ModalWrapperComponent
                            ref={smartLightsModalRef}
                            content={<SmartLights onCompletion={smartLightsCallback} />}
                            openButton={<button><Trans>Smarte Beleuchtung öffnen</Trans></button>}
                    />
            )}
          </div>
  );
}

export default App;
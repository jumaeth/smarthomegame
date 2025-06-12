import {useRef, useState} from "react";
import {MainStage} from "@/pixi/stages/MainStage";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera";
import {ModalWrapperComponent} from "@/components/ModalWrapperComponent";
import {Trans} from "@lingui/react/macro";

function App() {
  const securityCameraModalRef = useRef<{ closeModal: () => void }>(null);
  const [showSmartDeviceOverlay, setShowSmartDeviceOverlay] = useState(false);
  const securityCameraCallback = (): void => {
    setShowSmartDeviceOverlay(false);
    securityCameraModalRef.current?.closeModal();
  };

  return (
          <div>
            {/*TODO: merge logic with pixistage*/}
            {/*<main className="h-screen">*/}
            {/*  <AppRoutes/>*/}
            {/*</main>*/}
            {!showSmartDeviceOverlay && <MainStage triggerOverlay={() => setShowSmartDeviceOverlay(true)}/>}
            {showSmartDeviceOverlay && <ModalWrapperComponent
                    ref={securityCameraModalRef}
                    content={<SecurityCamera onCompletion={securityCameraCallback}/>}
                    openButton={<button><Trans>Überwachungskamera öffnen</Trans></button>}
            />}
          </div>
  );
}

export default App;
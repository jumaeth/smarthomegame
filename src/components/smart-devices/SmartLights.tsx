import {SmartDevice} from "./SmartDevice.tsx";
import "./Modal.css";

export const SmartLights = () => {

  const smartDeviceTv = new SmartDevice("Smarte Lampe",
          ["Möchtest du Bluetooth aktivieren?",
            "Möchtest du Wifi aktivieren?",
            "Möchtest du den Energieverbrauch aufzeichnen?",
            "Möchtest du die Verbindung mit der Smart App aktivieren?"], [true, true, false, false]);

  return (
          <>
            <div className="modal-content">
              <h1>
                {smartDeviceTv.name} Mission
              </h1>
              <h3>
                beantworte die folgenden Fragen ...
              </h3>
              <ul>
                {smartDeviceTv.getQuestions()}
              </ul>
            </div>
          </>
  );
};

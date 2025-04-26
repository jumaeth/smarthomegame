import {SmartDevice} from "./SmartDevice.tsx";
import "./Modal.css";

export const SmartTv = () => {


  const smartDeviceTv = new SmartDevice("Smart TV", ["Möchtest du die Spracherkennung aktivieren?", "Möchtest du die Kamera aktivieren?"], [false, false]);

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

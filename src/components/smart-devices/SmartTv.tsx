import {SmartDevice} from "./SmartDevice.tsx";
import {useState} from "react";
import "./Modal.css";

export const SmartTv = () => {
  const [modal, setModal] = useState(false)

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  const smartDeviceTv = new SmartDevice("Smart TV", ["Möchtest du die Spracherkennung aktivieren?", "Möchtest du die Kamera aktivieren?"], [false, false]);

  return (
          <>
            <button onClick={toggleModal} className="btn-modal"> {smartDeviceTv.name} öffnen</button>

            {modal && (
                    <div className="modal">
                      <div onClick={toggleModal} className="overlay"></div>
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
                        <button className="close-modal" onClick={toggleModal}>
                          Zurück
                        </button>
                      </div>
                    </div>
            )}
          </>
  );
};

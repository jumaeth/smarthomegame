import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import "./Modal.css";

export const SmartTv = () => {

  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("Quiz erfolgreich abgeschlossen!");
    } else {
      console.log("Quiz nicht bestanden.");
    }
  };

  const smartDeviceTv = new MultipleChoiceComponent(
          ["Möchtest du die Spracherkennung aktivieren?", "Möchtest du die Kamera aktivieren?"],
          [false, false],
          handleQuizCompletion);

  return (
          <>
            <h3>Smart TV</h3>
            <div className="modal-content">
              <h1>
                Smart TV Mission
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

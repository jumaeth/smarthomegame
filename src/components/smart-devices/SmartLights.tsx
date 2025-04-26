import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import "./Modal.css";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartLights = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("Quiz erfolgreich abgeschlossen!");
      onCompletion(isCompleted);
    } else {
      console.log("Quiz nicht bestanden.");
    }

  };

  const smartDeviceLights = new MultipleChoiceComponent(
          [
            "Möchtest du Bluetooth aktivieren?",
            "Möchtest du Wifi aktivieren?",
            "Möchtest du den Energieverbrauch aufzeichnen?",
            "Möchtest du die Verbindung mit der Smart App aktivieren?",
          ],
          [true, true, false, false],
          handleQuizCompletion
  );

  return (
          <>
            <h3>Smart Lights</h3>
            <div className="modal-content">
              <h1>Smart Lights Mission</h1>
              <h3>Beantworte die folgenden Fragen ...</h3>
              <ul>{smartDeviceLights.getQuestions()}</ul>
            </div>
          </>
  );
};
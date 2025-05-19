import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import "./Modal.css";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartKitchen = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("Quiz erfolgreich abgeschlossen!");
      onCompletion(isCompleted);
    } else {
      console.log("Quiz nicht bestanden.");
    }
  };

  const smartDeviceKitchen = new MultipleChoiceComponent(
          [
            "Möchtest du die Spracherkennung aktivieren?",
            "Möchtest du deinen persönlichen Kaffee konfigurieren?",
            "Möchtest du die Kamera im Kühlschrank aktivieren?",
            "Möchtest du deine Kreditkarte hinterlegen?"],
          [false, true, false, false],
          handleQuizCompletion
  );

  return (
          <>
            <h3>Smart Kitchen</h3>
            <div className="modal-content">
              <h1>Smart Kitchen Mission</h1>
              <h3>Beantworte die folgenden Fragen ...</h3>
              <ul>{smartDeviceKitchen.getQuestions()}</ul>
            </div>
          </>
  );
};
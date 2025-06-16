import { MultipleChoiceComponent } from "../MultipleChoiceComponent.tsx";
import "./Modal.css";
import {t} from "@lingui/core/macro";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartTv = ({ onCompletion }: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      console.log("Quiz erfolgreich abgeschlossen!");
      onCompletion(isCompleted);
    } else {
      console.log("Quiz nicht bestanden.");
    }
  };

  return (
          <>
            <h3>Smart TV</h3>
            <div className="modal-content">
              <h1>Smart TV Mission</h1>
              <h3>Beantworte die folgenden Fragen …</h3>
              <MultipleChoiceComponent
                      questions={[
                        t`Möchtest du die Spracherkennung aktivieren?`,
                        t`Möchtest du die Kamera aktivieren?`,
                      ]}
                      solutions={[false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};

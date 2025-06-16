import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import "./Modal.css";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";

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

  return (
          <>
            <h3><Trans>Smarte Beleuchtung</Trans></h3>
            <div className="modal-content">
              <h1><Trans>Smarte Beleuchtung Mission</Trans></h1>
              <h3><Trans>Beantworte die folgenden Fragen ...</Trans></h3>
              <MultipleChoiceComponent
                      questions={[
                        t`Möchtest du Bluetooth aktivieren?`,
                        t`Möchtest du Wifi aktivieren?`,
                        t`Möchtest du den Energieverbrauch aufzeichnen?`,
                        t`Möchtest du die Verbindung mit der Smart App aktivieren?`,
                      ]}
                      solutions={[true, true, false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};

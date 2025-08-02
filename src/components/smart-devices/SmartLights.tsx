import "./Modal.css";
import {t} from "@lingui/core/macro";
import {Trans} from "@lingui/react/macro";
import {MultipleChoiceComponent} from "@/components/MultipleChoiceComponent.tsx";

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
            <h1>
              <Trans>Smarte Beleuchtung</Trans>
            </h1>
            <div className="modal-content">
              <h3>
                <Trans>Beantworte die folgenden Fragen ...</Trans>
              </h3>
              <MultipleChoiceComponent
                      questions={[
                        t`Would you like to activate Bluetooth?`,
                        t`Would you like to activate Wifi?`,
                        t`Would you like to record your energy consumption?`,
                        t`Would you like to activate the connection with the Smart App?`,
                      ]}
                      solutions={[true, true, false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};
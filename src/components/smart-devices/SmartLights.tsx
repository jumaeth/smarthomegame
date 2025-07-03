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

  return (
          <>
            <h3>Smart lights</h3>
            <div className="modal-content">
              <h1>Smart lights mission</h1>
              <h3>Answer the following questions ...</h3>
              <MultipleChoiceComponent
                      questions={[
                        `Would you like to activate Bluetooth?`,
                        `Would you like to activate Wifi?`,
                        `Would you like to record your energy consumption?`,
                        `Would you like to activate the connection with the Smart App?`,
                      ]}
                      solutions={[true, true, false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};

import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import "./Modal.css";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartTv = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
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
              <h3>Answer the following questions ...</h3>
              <MultipleChoiceComponent
                      questions={[
                        `Would you like to activate voice recognition?`,
                        `Do you want to activate the camera?`,
                      ]}
                      solutions={[false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};

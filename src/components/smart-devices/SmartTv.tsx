import "./Modal.css";
import {useGameService} from "@/hooks/useGameService.tsx";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {MultipleChoiceComponent} from "@/components/MultipleChoiceComponent.tsx";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartTv = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const gameService = useGameService();
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      gameService.changeScore(10,'privacy');
      console.log("Quiz erfolgreich abgeschlossen!");
      onCompletion(isCompleted);
    } else {
      console.log("Quiz nicht bestanden.");
      gameService.changeScore(-10,'privacy');
      gameService.changeScore(5,'comfort');
    }
  };

  return (
          <>
            <h1>Smart TV</h1>
            <div className="modal-content">
              <h3><Trans>Answer the following questions</Trans>…</h3>
              <MultipleChoiceComponent
                      questions={[
                        t`Would you like to activate voice recognition?`,
                        t`Do you want to activate the camera?`,
                      ]}
                      solutions={[false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};
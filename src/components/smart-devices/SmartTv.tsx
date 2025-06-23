import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";
import "./Modal.css";
import {useGameService} from "@/hooks/useGameService.tsx";

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
            <h3>Smart TV</h3>
            <div className="modal-content">
              <h1>Smart TV Mission</h1>
              <h3>Beantworte die folgenden Fragen …</h3>
              <MultipleChoiceComponent
                      questions={[
                        `Möchtest du die Spracherkennung aktivieren?`,
                        `Möchtest du die Kamera aktivieren?`,
                      ]}
                      solutions={[false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};

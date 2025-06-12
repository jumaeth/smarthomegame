import {CaptchaComponent} from "../CaptchaComponent.tsx";
import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useState} from "react";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCamera = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
  };

  const MultipleChoiceProps = {
    questions: [
      t`Möchtest du den Internetzugang aktivieren?`,
      t`Möchtest du den Telefon Nutzung aktivieren?`,
      t`Möchtest du die Bilddaten zur Speicherung und Verarbeitung übermitteln?`,
      t`Möchtest du die Bilderkennung aktivieren?`
    ],
    solutions: [true, true, false, false],
    handleCompletion: (isCorrect: boolean) => {
      console.log("Completed:", isCorrect);
      setFrame(1);
    },
  };

  const [frame, setFrame] = useState(0);

  return (
          <div className="bg-[#e37412]">
            <h1><Trans>Überwachungskamera</Trans></h1>
            <div className="modal-content">
              {frame == 0 && (
                      <>
                        <p><Trans>Oh nein all deine Einstellungen wurden zurückgesetzt. Zeit sie neu festzulegen</Trans>
                        </p>
                        <MultipleChoiceComponent
                                questions={MultipleChoiceProps.questions}
                                solutions={MultipleChoiceProps.solutions}
                                onComplete={MultipleChoiceProps.handleCompletion}
                        />
                      </>)}
              {frame == 1 && (
                      <>
                        <p><Trans>Hey, du solltest deine Überwachungskameras neu anordnen. Das Smart Home hat bereits
                          eine
                          Vorauswahl getroffen. Bist du damit einverstanden? Wähle alle Kamera plazierungen die du
                          wieder
                          entfernen möchtest.</Trans></p>
                        <CaptchaComponent
                                pictureFolder="camera-placements"
                                solutions={[true, true, true, false, true, false, true, true, false, false, true, true, true]}
                                onComplete={handleQuizCompletion}
                        />
                      </>)}
            </div>
          </div>
  );
};
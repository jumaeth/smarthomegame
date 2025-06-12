import {CaptchaComponent} from "../CaptchaComponent.tsx";
import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useState} from "react";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCamera = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const [frame, setFrame] = useState(0);
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
    solutions: [
      true,
      true,
      t`Das ist nich nötig und ein Risiko für deine Privatsphäre`,
      t`Das ist nich nötig und ein Risiko für deine Privatsphäre`],
    handleCompletion: (isCorrect: boolean) => {
      console.log("Completed:", isCorrect);
      setFrame(1);
    },
  };

  const CaptchaComponentProps = {
    pictureFolder: "camera-placements",
    solutions: [
            true,
      true,
      true,
      t`Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
      true,
      t`Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
      true,
      true,
      t`Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
      t`Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
      true,
      true,
      true],
    onComplete: handleQuizCompletion
  }

  return (
          <div>
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
                                pictureFolder={CaptchaComponentProps.pictureFolder}
                                solutions={CaptchaComponentProps.solutions}
                                onComplete={CaptchaComponentProps.onComplete}
                        />
                      </>)}
            </div>
          </div>
  );
};
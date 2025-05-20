import {CaptchaComponent} from "../CaptchaComponent.tsx";
import {Trans} from "@lingui/react/macro";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCamera = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
  };

  return (
          <>
            <h1><Trans>Überwachungskamera</Trans></h1>
            <div className="modal-content">
              <p><Trans>Hey, du soltest deine Überwachungskameras neu anordnen. Das Smart Home hat bereits eine
                Vorauswahl getroffen. Bist du damit einverstanden? Wähle alle Kamera plazierungen die du wieder
                entfernen möchtest.</Trans></p>
              <CaptchaComponent
                      pictureFolder="camera-placements"
                      solutions={[true, true, true, false, true, false, true, true, false, false, true, true, true]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};
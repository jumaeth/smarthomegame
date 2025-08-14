import {t} from "@lingui/core/macro";
import {Trans} from "@lingui/react/macro";
import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartLights = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
  };

  return (
          <>
            <h1>
              <Trans>Smarte Beleuchtung</Trans>
            </h1>
            <div className="modal-content">
              <h3>
                <Trans>Berechtigungen verwalten:</Trans>
              </h3>
              <MultipleChoiceComponent
                      questions={[
                        t`Bluetooth aktivieren`,
                        t`Wifi aktivieren`,
                        t`Energieverbrauch aufzeichnen`,
                        t`Smart App verbinden`,
                      ]}
                      solutions={[true, true, false, false]}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </>
  );
};
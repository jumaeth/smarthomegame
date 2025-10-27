import {t} from "@lingui/core/macro";
import {Trans} from "@lingui/react/macro";
import {newSolution, Solution} from "@/types/solution.ts";
import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartLights = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const gameService = useGameService();
  const smartLightsDevice: SmartDevice = gameService.getDeviceByName("SmartTv");

  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
    const calculatedScores = {
      privacy: gameService.getScore().getPrivacyScore(),
      comfort: gameService.getScore().getComfortScore()
    };
    smartLightsDevice.getStatBlock().setValue("Smart Lights Privacy Score", calculatedScores.privacy);
    smartLightsDevice.getStatBlock().setValue("Smart Lights Comfort Score", calculatedScores.comfort);
    smartLightsDevice.getStatBlock().stopTimer();
  };

  const solutions: Solution[] = [
    newSolution(true, t`this setting is acceptable`, 5, 0, 1, -5),
    newSolution(true, t`this setting is acceptable`, 5, 0, 1, -5),
    newSolution(false, t`this setting is not acceptable`, 10, -2, -10, +2),
    newSolution(false, t`this setting is not acceptable`, 10, -6, +10, +6),
  ];

  const questions: string[] = [
    t`activate Bluetooth`,
    t`activate WiFi`,
    t`record energy consumption`,
    t`connect to smart app`,
  ];

  return (
          <div className="modal-window">
            <h1>
              <Trans>Smart Lighting</Trans>
            </h1>
            <div>
              <h3>
                <Trans>Manage permissions:</Trans>
              </h3>
              <MultipleChoiceComponent
                      questions={questions}
                      solutions={solutions}
                      onComplete={handleQuizCompletion}
              />
            </div>
          </div>
  );
};

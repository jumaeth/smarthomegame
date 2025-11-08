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
    newSolution(true, t`This setting is acceptable`, 5, 0, 1, -5),
    newSolution(true, t`This setting is acceptable`, 5, 0, 1, -5),
    newSolution(false, t`This setting is not acceptable`, 10, -2, -10, +2),
    newSolution(false, t`This setting is not acceptable`, 10, -6, +10, +6),
  ];

  const questions: string[] = [
    t`Activate Bluetooth`,
    t`Activate WiFi`,
    t`Record energy consumption`,
    t`Connect to smart app`,
  ];

  return (
          <div className="text-white px-[30px] py-[12px] w-[800px]">
            <h1 className="text-center font-['LoResBold',sans-serif] text-[28px] pb-[15px]">
              <Trans>Smart Lighting</Trans>
            </h1>
            <div className="text-xl px-[5px]">
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

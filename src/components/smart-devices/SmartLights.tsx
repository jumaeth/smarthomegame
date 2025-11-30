import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { newSolution, Solution } from "@/types/solution.ts";
import { MultipleChoiceComponent } from "@/components/mini-game/MultipleChoiceComponent.tsx";
import { useGameService } from "@/hooks/gameService/useGameService.tsx";
import { SmartDevice } from "@/objects/SmartDevice.ts";
import React, { useState } from "react";
import { DeviceNames } from "@/objects/DeviceNames.ts";

interface SmartLightsProps {
  onCompletion?: (isCompleted: boolean) => void;
}

export const SmartLights: React.FC<SmartLightsProps> = ({ onCompletion }) => {
  const gameService = useGameService();
  const smartLightsDevice: SmartDevice = gameService.getDeviceByName(DeviceNames.SMART_LIGHTS);
  const [showDialogue, setShowDialogue] = useState(true);


  const handleQuizCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      onCompletion?.(isCompleted);
    }
    const calculatedScores = {
      privacy: gameService.getScore().getPrivacyScore(),
      comfort: gameService.getScore().getComfortScore()
    };
    smartLightsDevice.getStatBlock().setValue(t`Smart Lights Privacy Score`, calculatedScores.privacy);
    smartLightsDevice.getStatBlock().setValue(t`Smart Lights Comfort Score`, calculatedScores.comfort);
  };

  const solutions: Solution[] = [
    newSolution(true, t`Bluetooth brings great functionality`, t`Bluetooth isn't dangerous for your device`, 5, 0, 1, -5),
    newSolution(true, t`Wifi is needed to control the lamp`, t`No Wifi, fancy coloured lamp`, 5, 0, 1, -5),
    newSolution(false, t`Correct, adds to much permissions`, t`Not needed to switch the light on and of`, 10, -2, -10, +2),
    newSolution(false, t`Correct, this isn't a must`, t`Can be an access point for intruders`, 10, -6, +10, +6),
  ];

  const questions: string[] = [
    t`Activate Bluetooth`,
    t`Activate WiFi`,
    t`Record energy consumption`,
    t`Connect to Smart App`,
  ];

  if (showDialogue) {
    return (
      <div className="flex flex-col items-center justify-center p-4">

        <h1 className="text-white text-3xl font-bold mb-8">
          <Trans>Smart Lights Setup</Trans></h1>
        <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
          <p className="leading-relaxed">
            <Trans>Oh no! Your smart lamp is corrupted as well. Even though it is nice to change colours,
              you surely don't want to have a disco lamp running all day long. Luckily, there is an easy solution:
              toggle the right permissions to regain control. But think carefully! Restrictive settings might
              lose you a lot of comfort. Try to figure out the right balance between comfort and privacy.
            </Trans></p>
        </div>
        <button onClick={() => setShowDialogue(false)}
          className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                      rounded-[30px] shadow-md transition-colors cursor-pointer"
        >
          <Trans>Continue</Trans>
        </button>
      </div>
    );
  }

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
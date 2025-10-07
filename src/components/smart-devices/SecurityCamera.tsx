import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";
import {CaptchaComponent} from "@/components/mini-game/CaptchaComponent.tsx";
import {newSolution} from "@/types/solution.ts";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCamera = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const [frame, setFrame] = useState(0);
  const handleQuizCompletion = (isCompleted: boolean): void => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
  };

  const multipleChoiceComponentProps = {
    questions: [
      t`internet connection`,
      t`smartphone connection`,
      t`cloud backup`,
      t`AI image recognition`
    ],
    solutions: [
      newSolution(true, t`this setting is ok`, 0, 5, 0, -5),
      newSolution(true, t`this setting is ok`, 0, 10, 0, -10),
      newSolution(false, t`This is not necessary and a risk to your privacy`, 10, -2, -10, +2),
      newSolution(false, t`This is not necessary and a risk to your privacy`, 10, -2, -10, +2),
    ],
    handleCompletion: (isCorrect: boolean): void => {
      console.log("Completed:", isCorrect);
      setFrame(1);
    }
  }

  const CaptchaComponentProps = {
    pictureFolder: "camera-placements",
    solutions: [
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera in your bedroom for privacy reasons.`, 10, -2, -10, 0),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera in your bathroom for privacy reasons`, 10, -2, -10, 0),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera pointing at your pool for privacy reasons`, 10, -2, -10, 0),
    ],
    handleCompletion: handleQuizCompletion,
  };

  return (
          <div>
            <h1><Trans>Security Camera</Trans></h1>
            <div>
              {frame == 0 && (
                      <>
                        <p>
                          <Trans>Oh no, all your settings have been reset. Time to set them again</Trans>
                        </p>
                        <MultipleChoiceComponent
                                questions={multipleChoiceComponentProps.questions}
                                solutions={multipleChoiceComponentProps.solutions}
                                onComplete={multipleChoiceComponentProps.handleCompletion}
                        />
                      </>)}
              {frame == 1 && (
                      <>
                        <p>
                          <Trans>Hey, you should rearrange your surveillance cameras. The smart home has already made a
                            preselection. Do you agree with this? Select all the camera placements you want to
                            keep.</Trans>
                        </p>
                        <CaptchaComponent
                                pictureFolder={CaptchaComponentProps.pictureFolder}
                                solutions={CaptchaComponentProps.solutions}
                                onComplete={CaptchaComponentProps.handleCompletion}
                        />
                      </>)}
            </div>
          </div>
  );
};
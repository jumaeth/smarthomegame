import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";
import {CaptchaComponent} from "@/components/mini-game/CaptchaComponent.tsx";
import {newSolution} from "@/types/solution.ts";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCameraGame = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const [frame, setFrame] = useState(0);
  const handleQuizCompletion = (isCompleted: boolean): void => {
    if (isCompleted) {
      onCompletion(isCompleted);
    }
  };

  const multipleChoiceComponentProps = {
    questions: [
      t`Internet connection`,
      t`Smartphone connection`,
      t`Cloud backup`,
      t`AI image recognition`
    ],
    solutions: [
      newSolution(true, t`This setting is ok`, 0, 5, 0, -5),
      newSolution(true, t`This setting is ok`, 0, 10, 0, -10),
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
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera in your bedroom for privacy reasons.`, 10, -2, -10, 0),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera in your bathroom for privacy reasons`, 10, -2, -10, 0),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(true, t`Correct, this placement is acceptable`, 0, 2, 0, -2),
      newSolution(false, t`This is a bad place for a camera, it is not recommended to place a camera pointing at your pool for privacy reasons`, 10, -2, -10, 0),
    ],
    handleCompletion: handleQuizCompletion,
  };

  return (
          <div  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-[#3a3a3a] border-[4px] border-white
                        shadow-[0_0_0_6px_#000]
                        px-[30px] py-[12px] w-[800px] max-w-[90vw]
                        rounded-none text-white text-lg leading-normal z-[100] h-auto
                        font-['LoResRegular',sans-serif]">
            <h1 className="text-center font-['LoResBold',sans-serif] text-[28px] pb-[15px]">
              <Trans>Security Camera</Trans>
            </h1>
            <div className="p-6 rounded-lg text-white min-w-[600px]">
              {frame == 0 && (
                      <div className="text-xl leading-relaxed">
                        <p>
                          <Trans>Oh no! All your settings have been reset. <br/>Time to set them again:</Trans>
                        </p>
                        <MultipleChoiceComponent
                                questions={multipleChoiceComponentProps.questions}
                                solutions={multipleChoiceComponentProps.solutions}
                                onComplete={multipleChoiceComponentProps.handleCompletion}
                        />
                      </div>)}
              {frame == 1 && (
                      <div className="text-xl leading-relaxed">
                        <p className="mb-4">
                          <Trans>Hey, you should rearrange your surveillance cameras. The smart home has already made a
                            preselection. Do you agree with this? Select all the camera placements you want to
                            keep.</Trans>
                        </p>
                        <CaptchaComponent
                                pictureFolder={CaptchaComponentProps.pictureFolder}
                                solutions={CaptchaComponentProps.solutions}
                                onComplete={CaptchaComponentProps.handleCompletion}
                        />
                      </div>)}
            </div>
          </div>
  );
};
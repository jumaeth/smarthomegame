import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { MultipleChoiceComponent } from "@/components/mini-game/MultipleChoiceComponent.tsx";
import { CaptchaComponent } from "@/components/mini-game/CaptchaComponent.tsx";
import { newSolution } from "@/types/solution.ts";

type onCompletionCallback = (isCompleted: boolean) => void;

export const SecurityCameraGame = ({ onCompletion }: { onCompletion: onCompletionCallback }) => {
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
      newSolution(true, t`Correct, this is needed to stream the view`, t`Without internet the images can't be observed live`, 0, 5, 0, -5),
      newSolution(true, t`Good to check your home on the go`, t`This is needed to check your camera on the go`, 0, 10, 0, -10),
      newSolution(false, t`You don't have much control over the cloud and its security`, t`Correct, this sensible data shouldn't go to the cloud`, 10, -2, -10, +2),
      newSolution(false, t`Sensible Data shouldn't go to AI and its company`, t`Correct, more privacy would be lost than comfort gained`, 10, -2, -10, +2),
    ],
    handleCompletion: (): void => {
      setFrame(1);
    }
  }

  const CaptchaComponentProps = {
    pictureFolder: "camera-placements",
    solutions: [
      newSolution(true, t`Correct, the hallway is not a privacy risk`, t`Wrong, nothing to worry about in the hallway`, 0, 2, 0, -2),
      newSolution(true, t`Correct, your TV room isn't a very privacy sensitive place`, t`Wrong, nothing private to see here`, 0, 2, 0, -2),
      newSolution(true, t`Correct, watching your front door helps to scare intruders away`, t`Wrong, checking your surroundings can increase the security of your house`, 0, 2, 0, -2),
      newSolution(false, t`You don't wan't someone watching you sleep`, t`Correct, nobody see you in this very private room`, 10, -2, -10, 0),
      newSolution(true, t`Correct, seeing you eat is not privacy inflicting`, t`Wrong, your kitchen table is not a privacy risk`, 0, 2, 0, -2),
      newSolution(false, t`Nobody should see you taking a shower. This is a very private space`, t`Correct, not a good place to observe people`, 10, -2, -10, 0),
      newSolution(true, t`Correct, watching your child can help in emergency situations`, t`Wrong, camera could provide valuable data about your child`, 0, 2, 0, -2),
      newSolution(true, t`Correct, you don't do private things at your desk`, t`Wrong, your desk does not contain private information`, 0, 2, 0, -2),
      newSolution(true, t`Correct, check on the mice in your basement doesn't hurt privacy`, t`Wrong, the basement isn't a very private place`, 0, 2, 0, -2),
      newSolution(true, t`Correct, just dust and old furniture here`, t`Wrong, dust and old furniture do not need privacy`, 0, 2, 0, -2),
      newSolution(true, t`Correct, watching your balcony door can stop intruders`, t`Wrong, watching your balcony can provide great security against intruders`, 0, 2, 0, -2),
      newSolution(true, t`Correct, not the most private things happening in your living room`, t`Wrong, your living room is not a very private room in your house`, 0, 2, 0, -2),
      newSolution(false, t`Correct, observing people at the pool is not correct. This is private space`, t`Wrong, nobody should see you enjoying your pool`, 10, -2, -10, 0),
    ],
    handleCompletion: handleQuizCompletion,
  };

  return (
    <div className="px-[30px] py-[12px] w-[800px] max-w-[90vw]
                        rounded-none text-white text-lg leading-normal z-[100] h-auto">
      <h1 className="text-center font-['LoResBold',sans-serif] text-[28px] pb-[15px]">
        <Trans>Security Camera</Trans>
      </h1>
      <div className="p-6 rounded-lg text-white min-w-[600px]">
        {frame == 0 && (
          <div className="text-xl leading-relaxed">
            <p>
              <Trans>Oh no! All your settings have been deleted. <br />Time to set them up again:</Trans>
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
              <Trans>Hey, you should reposition your surveillance cameras. The Smart Home has already made a preliminary selection. Do you agree with this? Select the camera placements you think are suitable.</Trans>
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
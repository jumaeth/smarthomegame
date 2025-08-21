import {CaptchaComponent} from "@/components/mini-game/CaptchaComponent.tsx";
import {MultipleChoiceComponent} from "@/components/mini-game/MultipleChoiceComponent.tsx";
import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";

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
            t`Would you like to activate Internet access?`,
            t`Do you want to activate the phone usage?`,
            t`Would you like to transfer the image data for storage and processing?`,
            t`Would you like to activate image recognition?`
        ],
        solutions: [
            true,
            true,
            t`This is not necessary and a risk to your privacy`,
            t`This is not necessary and a risk to your privacy`],
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
            t`This is a bad place for a camera because reasons`,
            true,
            t`This is a bad place for a camera because reasons`,
            true,
            true,
            t`This is a bad place for a camera because reasons`,
            t`This is a bad place for a camera because reasons`,
            true,
            true,
            true],
        onComplete: handleQuizCompletion
    }

    return (
            <div>
              <h1>
                <Trans>Überwachungskamera</Trans>
              </h1>
              <div className="modal-content">
                {frame == 0 && (
                        <>
                          <p>
                            <Trans>
                             Oh no, all your settings have been reset. Time to set them again
                            </Trans>
                          </p>
                          <MultipleChoiceComponent
                                  questions={MultipleChoiceProps.questions}
                                  solutions={MultipleChoiceProps.solutions}
                                  onComplete={MultipleChoiceProps.handleCompletion}
                          />
                        </>)}
                {frame == 1 && (
                        <>
                          <p>
                            <Trans>
                              Hey, you should rearrange your surveillance cameras. The smart home has already made a

                              preselection. Do you agree with this? Select all the camera placements you want to remove

                              again.
                            </Trans>
                          </p>
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
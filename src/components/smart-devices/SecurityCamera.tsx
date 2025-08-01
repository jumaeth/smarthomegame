import {CaptchaComponent} from "../CaptchaComponent.tsx";
import {MultipleChoiceComponent} from "../MultipleChoiceComponent.tsx";
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
            `Would you like to activate Internet access?`,
            `Do you want to activate the phone usage?`,
            `Would you like to transfer the image data for storage and processing?`,
            `Would you like to activate image recognition?`
        ],
        solutions: [
            true,
            true,
            `This is not necessary and a risk to your privacy`,
            `This is not necessary and a risk to your privacy`],
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
            `This is a bad place for a camera because reasons`,
            true,
            `This is a bad place for a camera because reasons`,
            true,
            true,
            `This is a bad place for a camera because reasons`,
            `This is a bad place for a camera because reasons`,
            true,
            true,
            true],
        onComplete: handleQuizCompletion
    }

    return (
        <div>
            <h1>Surveillance camera</h1>
            <div className="modal-content">
                {frame == 0 && (
                    <>
                        <h3>Oh no, all your settings have been reset. Time to set them again
                        </h3>
                        <MultipleChoiceComponent
                            questions={MultipleChoiceProps.questions}
                            solutions={MultipleChoiceProps.solutions}
                            onComplete={MultipleChoiceProps.handleCompletion}
                        />
                    </>)}
                {frame == 1 && (
                    <>
                        <p>Hey, you should rearrange your surveillance cameras. The smart home already has made
                            a
                            preselection. Do you agree with this? Select all camera placements that
                            you want
                            to remove again</p>
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
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
            `Möchtest du den Internetzugang aktivieren?`,
            `Möchtest du den Telefon Nutzung aktivieren?`,
            `Möchtest du die Bilddaten zur Speicherung und Verarbeitung übermitteln?`,
            `Möchtest du die Bilderkennung aktivieren?`
        ],
        solutions: [
            true,
            true,
            `Das ist nich nötig und ein Risiko für deine Privatsphäre`,
            `Das ist nich nötig und ein Risiko für deine Privatsphäre`],
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
            `Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
            true,
            `Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
            true,
            true,
            `Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
            `Das ist ein Schlechter Platz für eine Kamera weil Gründe`,
            true,
            true,
            true],
        onComplete: handleQuizCompletion
    }

    return (
        <div>
            <h1>Überwachungskamera</h1>
            <div className="modal-content">
                {frame == 0 && (
                    <>
                        <p>Oh nein all deine Einstellungen wurden zurückgesetzt. Zeit sie neu festzulegen
                        </p>
                        <MultipleChoiceComponent
                            questions={MultipleChoiceProps.questions}
                            solutions={MultipleChoiceProps.solutions}
                            onComplete={MultipleChoiceProps.handleCompletion}
                        />
                    </>)}
                {frame == 1 && (
                    <>
                        <p>Hey, du solltest deine Überwachungskameras neu anordnen. Das Smart Home hat bereits
                            eine
                            Vorauswahl getroffen. Bist du damit einverstanden? Wähle alle Kamera plazierungen die du
                            wieder
                            entfernen möchtest.</p>
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
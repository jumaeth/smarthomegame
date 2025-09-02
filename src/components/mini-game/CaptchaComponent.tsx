import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {loadImagesFromFolder} from "@/utils/loadImages.ts";
import Button from "@/components/general-ui/Button.tsx";
import {Solution} from "@/types/solution.ts";
import {useGameService} from "@/hooks/useGameService.tsx";

type CaptchaProps = {
  pictureFolder: string;
  solutions: Solution[];
  onComplete: (isCompleted: boolean) => void;
};

export const CaptchaComponent = ({pictureFolder, solutions, onComplete}: CaptchaProps) => {
  const gameService = useGameService();
  const imageList = loadImagesFromFolder(pictureFolder);
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");
  const [feedbackMsgColor, setFeedbackMsgColor] = useState<string>("black");

  const [answers, setAnswers] = useState<boolean[]>(new Array(solutions.length).fill(true));
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [imageGrid, setImageGrid] = useState<number[]>(Array.from({length: 9}, (_, i) => i));
  const [nextImage, setNextImage] = useState<number>(9);

  const handleImageClick = (gridIndex: number) => {
    if (isSubmitted) return;
    const imageIndex = imageGrid[gridIndex];
    if (imageIndex < solutions.length) {
      const next = [...answers];
      next[imageIndex] = true;
      setAnswers(next);
      setFeedbackMsgColor(solutions[imageIndex].booleanSolution ? "green" : "red");
      setFeedbackMsg(solutions[imageIndex].solutionMessage);
      setImageGrid(prev => {
        const updated = [...prev];
        updated[gridIndex] = nextImage < imageList.length ? nextImage : -1;
        return updated;
      });
      setNextImage(prev => prev + 1);
    }
  };


  const submitAnswer = () => {
    setIsSubmitted(true);
  };

  const continueGame = () => {
    let privacyScore: number = 0;
    let comfortScore: number = 0;
    answers.map((b, i) => {
      if (b === solutions[i].booleanSolution) {
        privacyScore += solutions[i].privacyScoreGain
        comfortScore += solutions[i].privacyScoreGain
      } else {
        privacyScore += solutions[i].privacyScorePenalty
        comfortScore += solutions[i].privacyScorePenalty
      }
    });
    gameService.changeScore(privacyScore, 'privacy');
    gameService.changeScore(comfortScore, 'comfort');
    onComplete(true);
  };

  return (
          <div className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              {imageGrid.map((imageIndex, gridIndex) => (
                      <div
                              key={gridIndex}
                              className={`w-30 h-30 flex items-center justify-center rounded-lg overflow-hidden ${imageIndex >= 0 && !isSubmitted ? "cursor-pointer hover:opacity-80 border-2 border-gray-300" : "bg-gray-100"}
              transition-all duration-200`}
                              onClick={() => imageIndex >= 0 && !isSubmitted && handleImageClick(gridIndex)}
                      >
                        {imageIndex >= 0 && imageIndex < imageList.length ? (
                                <img
                                        src={imageList[imageIndex]}
                                        alt={`question-${imageIndex}`}
                                        className="w-full h-full object-cover"
                                />) : (<div className="w-full h-full bg-gray-200"></div>)}
                      </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2">
              {feedbackMsg && <p className={`text-${feedbackMsgColor}-600 text-m mt-1`}>{feedbackMsg}</p>}
              {!isSubmitted ? <Button onClick={submitAnswer}><Trans>Send answer</Trans></Button> :
                      <Button onClick={continueGame}><Trans>Continue game</Trans></Button>}
            </div>
          </div>
  );
};
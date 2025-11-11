import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {loadImagesFromFolder} from "@/utils/loadImages.ts";
import Button from "@/components/general-ui/Button.tsx";
import {Solution} from "@/types/solution.ts";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import privacyIcon from "@/assets/coins/privacy_coin.png";
import comfortIcon from "@/assets/coins/comfort_coin.png";

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

  const [answers, setAnswers] = useState<boolean[]>(new Array(solutions.length).fill(false));
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [imageGrid, setImageGrid] = useState<number[]>(Array.from({length: 9}, (_, i) => i));
  const [nextImage, setNextImage] = useState<number>(9);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [fadeOut, setFadeOut] = useState<boolean>();
  const fadeOutDuration: number = 2000;

  const handleImageClick = (gridIndex: number) => {
    if (isSubmitted) return;
    setFadeOut(false);
    const imageIndex = imageGrid[gridIndex];
    if (imageIndex < 0 || imageIndex >= solutions.length) return;
    setCurrentIndex(imageIndex);
    setAnswers(prev => {
      const next = [...prev];
      next[imageIndex] = true; // or toggle if that’s desired: next[imageIndex] = !next[imageIndex];
      const isCorrect = next[imageIndex] === solutions[imageIndex].booleanSolution;
      setFeedbackMsgColor(isCorrect ? "green" : "red");
      setFeedbackMsg(solutions[imageIndex].solutionMessage);
      return next;
    });
    setImageGrid(prev => {
      const updated = [...prev];
      updated[gridIndex] = nextImage < imageList.length ? nextImage : -1;
      return updated;
    });
    setNextImage(prev => prev + 1);
    setTimeout(() => {
      setFadeOut(true);
    }, fadeOutDuration);
  };

  const submitAnswer = () => {
    setIsSubmitted(true);
  };

  const continueGame = () => {
    let privacyScore = 0;
    let comfortScore = 0;
    answers.forEach((b, i) => {
      if (i >= solutions.length) return;
      if (b === solutions[i].booleanSolution) {
        privacyScore += solutions[i].privacyScoreGain;
        comfortScore += solutions[i].comfortScoreGain;
      } else {
        privacyScore += solutions[i].privacyScorePenalty;
        comfortScore += solutions[i].comfortScorePenalty;
      }
    });
    gameService.changeScore(privacyScore, "privacy");
    gameService.changeScore(comfortScore, "comfort");
    onComplete(true);
  };

  const formatWithSign = new Intl.NumberFormat("en-US", {
    signDisplay: "always",
  });

  const inRange = currentIndex >= 0 && currentIndex < solutions.length;
  const isCorrect =
          inRange && answers[currentIndex] === solutions[currentIndex].booleanSolution;
  const privacyDelta = inRange
          ? isCorrect
                  ? solutions[currentIndex].privacyScoreGain
                  : solutions[currentIndex].privacyScorePenalty
          : 0;
  const comfortDelta = inRange
          ? isCorrect
                  ? solutions[currentIndex].comfortScoreGain
                  : solutions[currentIndex].comfortScorePenalty
          : 0;

  return (
          <div className="flex flex-col items-center gap-2">
            <div className="grid grid-cols-3 gap-4">
              {imageGrid.map((imageIndex, gridIndex) => (
                      <div
                              key={gridIndex}
                              className={`w-40 h-40 flex items-center justify-center rounded-lg overflow-hidden ${
                                      imageIndex >= 0 && !isSubmitted
                                              ? "cursor-pointer hover:opacity-80 border-2 border-gray-300"
                                              : "bg-gray-100"
                              } transition-all duration-200`}
                              onClick={() => imageIndex >= 0 && !isSubmitted && handleImageClick(gridIndex)}
                      >
                        {imageIndex >= 0 && imageIndex < imageList.length ? (
                                <img
                                        src={imageList[imageIndex]}
                                        alt={`question-${imageIndex}`}
                                        className="w-full h-full object-cover"
                                />
                        ) : (
                                <div className="w-full h-full bg-gray-200"/>
                        )}
                      </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {feedbackMsg && (
                      <div className={`flex space-x-2 ${fadeOut ? 'transition-opacity duration-2000 opacity-0' : 'opacity-100'}`}>
                        <p className={`mt-1 text-m ${feedbackMsgColor === "green" ? "text-green-600" : feedbackMsgColor === "red" ? "text-red-600" : "text-black"}`}>
                          {feedbackMsg}
                        </p>
                      </div>
              )}

              {inRange && feedbackMsg && (
                      <div className={`flex space-x-2 ${fadeOut ? 'transition-opacity duration-2000 opacity-0' : 'opacity-100'}`}>
                        <span>{formatWithSign.format(privacyDelta)}</span>
                        <img src={privacyIcon} className="h-6" alt="privacy-icon"/>
                        <span>{formatWithSign.format(comfortDelta)}</span>
                        <img src={comfortIcon} className="h-6" alt="comfort-icon"/>
                      </div>
              )}
            </div>

            {!isSubmitted ? (
                    <Button onClick={submitAnswer} className="px-10 py-[10px] text-white bg-blue-600 text-lg font-semibold hover:bg-blue-700
                      rounded-xl shadow-md transition-colors cursor-pointer">
                      <Trans>Send answer</Trans>
                    </Button>
            ) : (
                    <Button onClick={continueGame} className="px-10 py-[10px] text-white bg-gray-600 text-lg font-semibold hover:bg-gray-700
                      rounded-xl shadow-md transition-colors cursor-pointer">
                      <Trans>Close</Trans>
                    </Button>
            )}
          </div>
  );
};

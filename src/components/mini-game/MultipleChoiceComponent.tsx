import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import Toggle from "@/components/general-ui/Toggle.tsx";
import Button from "@/components/general-ui/Button.tsx";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {GameService} from "@/services/GameService.ts";
import privacyIcon from "@/assets/coins/privacy_coin.png";
import comfortIcon from "@/assets/coins/comfort_coin.png";
import {Solution} from "@/types/solution.ts";

type MultipleChoiceProps = {
  questions: string[];
  solutions: Solution[];
  onComplete: (isCompleted: boolean) => void;
};

export const MultipleChoiceComponent = ({
                                          questions,
                                          solutions,
                                          onComplete,
                                        }: MultipleChoiceProps) => {
  const gameService: GameService = useGameService();
  const [answers, setAnswers] = useState<boolean[]>(new Array(questions.length).fill(true));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fadeOut, setFadeOut] = useState<boolean>();
  const fadeOutDuration: number = 2000;

  const handleAnswer = (i: number, answer: boolean) => {
    const next = [...answers];
    next[i] = answer;
    setAnswers(next);
  };

  const submitAnswer = () => {
    setIsSubmitted(true);
    setFadeOut(false);
    setTimeout(() => {
      setFadeOut(true);
    }, fadeOutDuration);
  };

  function continueGame() {
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
  }

  const formatWithSign = new Intl.NumberFormat('en-US', {
    signDisplay: 'always',
  });

  return (
          <div className="grid">
            <ul className="my-4">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === solutions[i].booleanSolution;
                return (
                        <li key={i} className="mt-2.5 mb-3 p-3 border border-grey-400 rounded-md">
                          <label className="flex items-center cursor-pointer">
                            {q}
                            <div className="ml-auto">
                              <Toggle
                                      isOn={answers[i]}
                                      defaultChecked={true}
                                      disabled={isSubmitted}
                                      onToggle={(newValue) => handleAnswer(i, newValue)}
                                      onColor={"bg-green-500"}
                                      offColor={"bg-red-300"}
                              />
                            </div>
                          </label>
                          {isSubmitted && (
                                  <div
                                          className={`flex space-x-2 transition-opacity${
                                                  fadeOut ? 'opacity-0' : 'opacity-100'
                                          }`}
                                  >
                  <span className="ml-8">
                    {isCorrect ? "✅ " + solutions[i].solutionMessage : "❌ " + solutions[i].solutionMessage}
                  </span>
                                    <span>
                    {isCorrect ? formatWithSign.format(solutions[i].privacyScoreGain) : formatWithSign.format(solutions[i].privacyScorePenalty)}
                  </span>
                                    <img src={privacyIcon} className="h-6" alt="privacy-icon"/>
                                    <span>
                    {isCorrect ? formatWithSign.format(solutions[i].comfortScoreGain) : formatWithSign.format(solutions[i].comfortScorePenalty)}
                  </span>
                                    <img src={comfortIcon} className="h-6" alt="comfort-icon"/>
                                  </div>
                          )}
                        </li>
                );
              })}
            </ul>
            {!isSubmitted ? (
                    <Button onClick={submitAnswer} className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                      rounded-[30px] shadow-md transition-colors cursor-pointer">
                      <Trans>Send answer</Trans>
                    </Button>
            ) : (
                    <Button onClick={continueGame} className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                      rounded-[30px] shadow-md transition-colors cursor-pointer">
                      <Trans>Continue</Trans>
                    </Button>
            )}
          </div>
  );
};
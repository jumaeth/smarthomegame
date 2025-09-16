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

  const handleAnswer = (i: number, answer: boolean) => {
    const next = [...answers];
    next[i] = answer;
    setAnswers(next);
  };

  const submitAnswer = () => {
    setIsSubmitted(true);
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
                        <li key={i} className="my-4">
                          <label className="flex">
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
                                  < div className="flex space-x-2">
                                    <span className="ml-8">{isCorrect ? "✅ " + solutions[i].solutionMessage
                                            : "❌ " + solutions[i].solutionMessage}
                                    </span>
                                    <span>{isCorrect ? formatWithSign.format(solutions[i].privacyScoreGain) : formatWithSign.format(solutions[i].privacyScorePenalty)}</span>
                                    <img src={privacyIcon} className="h-6" alt="privacy-icon"/>
                                    <span>{isCorrect ? formatWithSign.format(solutions[i].comfortScoreGain) : formatWithSign.format(solutions[i].comfortScorePenalty)}</span>
                                    <img src={comfortIcon} className="h-6" alt="comfort-icon"/>
                                  </div>
                          )}
                        </li>
                );
              })}
            </ul>

            {!isSubmitted ? (
                    <Button onClick={submitAnswer}>
                      <Trans>Send answer</Trans>
                    </Button>
            ) : (
                    <Button onClick={continueGame}><Trans>Continue</Trans></Button>
            )}
          </div>
  );
};
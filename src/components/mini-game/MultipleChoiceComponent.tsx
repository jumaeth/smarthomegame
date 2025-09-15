import {useState} from "react";
import {Trans} from "@lingui/react/macro";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";

type MultipleChoiceProps = {
  questions: string[];
  solutions: (boolean | string)[];
  onComplete: (isCompleted: boolean) => void;
};

export const MultipleChoiceComponent = ({
                                          questions,
                                          solutions,
                                          onComplete,
                                        }: MultipleChoiceProps) => {
  const [answers, setAnswers] = useState<boolean[]>(
          new Array(questions.length).fill(false)
  );
  const [submitted, setSubmitted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");
  const gameService = useGameService();


  const handleAnswer = (i: number, answer: boolean) => {
    if (!gameService.areSmartDevicesEnabled())return;
    const next = [...answers];
    next[i] = answer;
    setAnswers(next);
    if (answer !== solutions[i] && typeof solutions[i] === "string") {
      setFeedbackMsg(solutions[i].toString());
    } else {
      setFeedbackMsg("");
    }
  };

  const submitAnswer = () => {
    if (!gameService.areSmartDevicesEnabled())return;
    const isAllCorrect = answers.every((ans, i) => ans === solutions[i]);
    setSubmitted(true);
    onComplete(isAllCorrect);
  };

  function resetAnswers() {
    setAnswers(new Array(questions.length).fill(false));
    setSubmitted(false);
  }

  return (
          <div>
            <ul>
              {questions.map((q, i) => {
                const isCorrect = answers[i] === solutions[i];
                return (
                        <li key={i} style={{marginBottom: 8}}>
                          <label>
                            <input
                                    type="checkbox"
                                    disabled={submitted}
                                    checked={answers[i]}
                                    onChange={(e) => handleAnswer(i, e.target.checked)}
                            />{" "}
                            {q}
                          </label>
                          {submitted && answers[i] && (
                                  <span style={{marginLeft: 8}}>
                  {isCorrect ? "✅" : "❌"}
                </span>
                          )}
                        </li>
                );
              })}
            </ul>
            <p className="text-red-600">{feedbackMsg}</p>

            {!submitted ? (
                    <button onClick={submitAnswer}>
                      <Trans>Send answer</Trans>
                    </button>
            ) : (
                    <button onClick={resetAnswers}><Trans>Try again</Trans></button>
            )}
          </div>
  );
};
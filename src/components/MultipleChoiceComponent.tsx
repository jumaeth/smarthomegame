import React, {useState} from "react";
import Button from "@/components/ui-components/Button";
import {Trans} from "@lingui/react/macro";

type MultipleChoiceProps = {
  questions: string[];
  solutions: (boolean | string)[];
  onComplete: (isCompleted: boolean) => void;
};

export const MultipleChoiceComponent: React.FC<MultipleChoiceProps> = ({
                                                                         questions,
                                                                         solutions,
                                                                         onComplete,
                                                                       }: MultipleChoiceProps) => {
  const [answers, setAnswers] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const handleAnswer = (i: number, answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[i] = answer;
    setAnswers(newAnswers);
    if (answer !== solutions[i] && typeof solutions[i] === "string") {
      setFeedbackMsg(solutions[i].toString());
    } else {
      setFeedbackMsg("");
    }
  };

  const submitAnswer = () => {
    const isCorrect = answers.every((val, i) => val === solutions[i]);
    onComplete(isCorrect);
  };

  return (
          <div>
            <ul>
              {questions.map((q, i) => (
                      <li key={i}>
                        {q}
                        <label className="switch">
                          <input
                                  type="checkbox"
                                  checked={answers[i]}
                                  onChange={(e) => handleAnswer(i, e.target.checked)}
                          />
                        </label>
                      </li>
              ))}
            </ul>
            <p className="text-red-600">{feedbackMsg}</p>
            <Button onClick={submitAnswer} disabled={false}>
              <Trans>Antwort abschicken</Trans>
            </Button>
          </div>
  );
};

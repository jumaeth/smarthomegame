import React, {useState} from "react";
import {Trans} from "@lingui/react/macro";

type MultipleChoiceProps = {
  questions: string[];
  solutions: boolean[];
  onComplete: (isAllCorrect: boolean) => void;
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


  const handleAnswer = (i: number, value: boolean) => {
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
    if (answer !== solutions[i] && typeof solutions[i] === "string") {
      setFeedbackMsg(solutions[i].toString());
    } else {
      setFeedbackMsg("");
    }
  };

  const submitAnswer = () => {
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
                          {q}
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
                      <Trans>Antwort abschicken</Trans>
                    </button>
            ) : (
                    <button onClick={resetAnswers}>Nochmals versuchen</button>
            )}
          </div>
  );
};
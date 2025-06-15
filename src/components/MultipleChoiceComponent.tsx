import { useState } from "react";

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

  const handleAnswer = (i: number, value: boolean) => {
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
  };

  const submitAnswer = () => {
    const isAllCorrect = answers.every((ans, i) => ans === solutions[i]);
    setSubmitted(true);
    onComplete(isAllCorrect);
  };

  return (
          <div>
            <ul>
              {questions.map((q, i) => {
                const isCorrect = answers[i] === solutions[i];
                return (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <label>
                            <input
                                    type="checkbox"
                                    disabled={submitted}
                                    checked={answers[i]}
                                    onChange={(e) => handleAnswer(i, e.target.checked)}
                            />{" "}
                            {q}
                          </label>
                          {submitted && (
                                  <span style={{ marginLeft: 8 }}>
                  {isCorrect ? "✅" : "❌"}
                </span>
                          )}
                        </li>
                );
              })}
            </ul>
            {!submitted ? (
                    <button onClick={submitAnswer}>Antwort abschicken</button>
            ) : null}
          </div>
  );
};

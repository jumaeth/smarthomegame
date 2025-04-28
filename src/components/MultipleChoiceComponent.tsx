type MultipleChoiceCallback = (isCompleted: boolean) => void;

export class MultipleChoiceComponent {
  questions: string[];
  solutions: boolean[];
  answers: boolean[];
  onComplete: MultipleChoiceCallback;

  constructor(
          questions: string[],
          solutions: boolean[],
          onComplete: MultipleChoiceCallback
  ) {
    this.questions = questions;
    this.solutions = solutions;
    this.answers = new Array(this.questions.length).fill(false);
    this.onComplete = onComplete;
  }

  getQuestions() {
    const handleAnswer = (i: number, answer: boolean) => {
      this.answers[i] = answer;
    };

    const submitAnswer = () => {
      const isCorrect = this.answers.every((val, i) => val === this.solutions[i]);
      console.log(isCorrect ? "Yay! answers are correct" : "Oh No! your answers are not correct");
      this.onComplete(isCorrect); // Callback aufrufen
    };

    return (
            <div>
              <ul>
                {this.questions.map((q, i) => (
                        <li key={i}>
                          {q}
                          <label className="switch">
                            <input
                                    type="checkbox"
                                    onChange={(e) => handleAnswer(i, e.target.checked)}
                            />
                          </label>
                        </li>
                ))}
                <button onClick={() => submitAnswer()}>Antwort abschicken</button>
              </ul>
            </div>
    );
  }
}
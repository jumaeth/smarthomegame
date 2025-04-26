export class SmartDevice {
  name: string;
  questions: string[];
  solutions: boolean[];
  answers: boolean[];

  constructor(deviceName: string, questions: string[], solutions: boolean[]) {
    this.name = deviceName;
    this.questions = questions;
    this.solutions = solutions;
    this.answers = new Array(this.questions.length).fill(false);
  }

  getQuestions() {

    const handleAnswer = (i: number, answer: boolean) => {
      this.answers[i] = answer
    };

    const submitAnswer = () => {
      if (this.answers.every((val, i) => val === this.solutions[i])) {
        console.log("Yay! answers are correct");
        //   GameService.updateScore(2);
      } else {
        console.log("Oh No! your answers are not correct");
        //   GameService.updateScore(-2);
      }
    };
    return (
            <div className={this.name}>
              <h3>{this.name}</h3>
              <ul>
                {this.questions.map((q, i) => (
                        <li key={i}>
                          {q}
                          <label className="switch">
                            <input
                                    type="checkbox"
                                    onChange={(e) =>
                                            handleAnswer(i, e.target.checked)
                                    }
                            />
                          </label>
                        </li>
                ))}
                <button onClick={() => submitAnswer()}>Antwort abschicken</button>
              </ul>
            </div>
    )
  }
}
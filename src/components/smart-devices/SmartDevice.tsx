export class SmartDevice{
    name: string;
    questions: string[];

    constructor(deviceName: string, questions : string[]) {
        this.name = deviceName
        this.questions = questions
    }

    getQuestions(){
        return (
            <div className={this.name}>
                <h2>{this.name}</h2>
                <ul>
                    {this.questions.map((q,i)=>(
                            <li key={i}>{q}</li>
                        ))}
                </ul>
            </div>
        )
    }
}

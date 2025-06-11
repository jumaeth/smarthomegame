import { CookingGameComponent } from "../cookingGame/CookingGameComponent.tsx";
import "./Modal.css";
import {useEffect, useState} from "react";

//type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartKitchen = ({onCompletion, reload}) => {

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if(completed){
      console.log("completed");
      onCompletion(true);
    }
  }, [completed]);

  //{ onCompletion }: { onCompletion: onCompletionCallback }
  // const handleQuizCompletion = (isCompleted: boolean) => {
  //   if (isCompleted) {
  //     console.log("Quiz erfolgreich abgeschlossen!");
  //     onCompletion(isCompleted);
  //   } else {
  //     console.log("Quiz nicht bestanden.");
  //   }
  // };

  return (
          <>
              <CookingGameComponent
                      setCompleted={setCompleted}
                      reload={reload}
              />
          </>
  );
};

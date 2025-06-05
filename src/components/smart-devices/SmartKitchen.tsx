import { CookingGameComponent } from "../cookingGame/CookingGameComponent.tsx";
import "./Modal.css";

//type onCompletionCallback = (isCompleted: boolean) => void;

export const SmartKitchen = () => {
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
                      title="My Title"
                      description="My Description"
              />
          </>
  );
};

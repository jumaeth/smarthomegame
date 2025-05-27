import { CookingGameComponent } from "../CookingGameComponent.tsx";
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
            <h3>Smart Kitchen</h3>
              <CookingGameComponent
                      title="My Title"
                      description="My Description"
              />
          </>
  );
};

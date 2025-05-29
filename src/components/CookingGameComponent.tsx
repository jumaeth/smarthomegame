import {Application} from '@pixi/react';
import {AlphaFilter} from "pixi.js";
import { useState} from "react";
import {ClickableElement} from "../objects/ClickableElement.ts";
import {SpriteRender} from "./SpriteRender.tsx";
import {RenderElement} from "../objects/RenderElement.ts";
import { Text as PixiText } from '@pixi/text';

const GameStage = ({ setStage }) => {

  const highlightAlpha = 1.35;

  const clearSprites = () => {
    setRenderElements([]);
  };

  const removeNotification = () => {
    if(renderElements.filter(element => element.id === "recipeNotification").length > 0){
      const newRenderElements = renderElements.filter(element => element.id !== "recipeNotification");
      setRenderElements(newRenderElements);
    }

    setStage("recipe");
  };


  const recipe             = new ClickableElement("recipe", 0.14, 75, 70, "/cooking-sprites/recipe.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), removeNotification);
  const recipeNotification = new ClickableElement("recipeNotification", 0.08, 130, 30, "/cooking-sprites/notification.png", 100, 100, new AlphaFilter(), null);
  const ingredients        = new ClickableElement("ingredients", 0.125, 70, 185, "/cooking-sprites/ingredients.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const herd               = new ClickableElement("herd", 0.2125, 265, 120, "/cooking-sprites/herd.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const pots               = new ClickableElement("pots", 0.15, 465, 70, "/cooking-sprites/pots.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const plate              = new ClickableElement("plate", 0.12, 465, 190, "/cooking-sprites/plate.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);

  const [renderElements, setRenderElements] = useState(() => {
    return [recipe, recipeNotification, ingredients, herd, pots, plate];
  });


  return (
          <>
            {renderElements.map((object) => (
                    <SpriteRender key={object.id} content={object} />
            ))}
          </>
  );
};

const RecipeStage = ( {setStage} ) => {
  console.log("Reached recipe stage");
  const returnToGame = () => {
    setStage("game");
  };



  return (
          <>
            <SpriteRender content={new RenderElement("someId", 0.1, 100,100, "/cooking-sprites/recipe.png", 100, 100)}/>
          </>
          )
};

export const CookingGameComponent = () => {

  const [currentStage, setCurrentStage] = useState("game");

  const restart = () => {setCurrentStage("game")};

  const background         = new ClickableElement("background", 0.3, 300, 100, "/cooking-sprites/counter.png", 100, 100, new AlphaFilter(), restart);


  const stageMap = {
    game: () => <GameStage setStage={setCurrentStage} />,
    recipe: () => <RecipeStage setStage={setCurrentStage} />,
  };


  return (
          <div className="mt-5">
              {(
                      <Application width={545} height={250} autostart backgroundColor={0xd87f20}>
                        <SpriteRender content={background}/>
                        {stageMap[currentStage]()}
                      </Application>
              )}
          </div>
  );
};

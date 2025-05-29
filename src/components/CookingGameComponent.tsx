import {Application} from '@pixi/react';
import {AlphaFilter} from "pixi.js";
import {useState} from "react";
import {ClickableElement} from "../objects/ClickableElement.ts";
import {SpriteRender} from "./SpriteRender.tsx";

const GameStage = ({ renderElements }: { renderElements: ClickableElement[] }) => {
  return (
          <>
            {renderElements.map((object) => (
                    <SpriteRender key={object.id} content={object} />
            ))}
          </>
  );
};

export const CookingGameComponent = () => {
  const highlightAlpha = 1.35;

  const clearSprites = () => {
    console.log("clearSprites");
    setRenderElements([background]);
  };

  const removeNotification = () => {
    if(renderElements.filter(element => element.id === "recipeNotification").length > 0){
      const newRenderElements = renderElements.filter(element => element.id !== "recipeNotification");
      setRenderElements(newRenderElements);
    }
  };

  const background         = new ClickableElement("background", 0.3, 300, 100, "/cooking-sprites/counter.png", 100, 100, new AlphaFilter(), null);
  const recipe             = new ClickableElement("recipe", 0.14, 75, 70, "/cooking-sprites/recipe.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), removeNotification);
  const recipeNotification = new ClickableElement("recipeNotification", 0.08, 130, 30, "/cooking-sprites/notification.png", 100, 100, new AlphaFilter(), null);
  const ingredients        = new ClickableElement("ingredients", 0.125, 70, 185, "/cooking-sprites/ingredients.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const herd               = new ClickableElement("herd", 0.2125, 265, 120, "/cooking-sprites/herd.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const pots               = new ClickableElement("pots", 0.15, 465, 70, "/cooking-sprites/pots.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);
  const plate              = new ClickableElement("plate", 0.12, 465, 190, "/cooking-sprites/plate.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), clearSprites);

  const renderAll = () => {
    return [
      background, recipe, recipeNotification, ingredients, herd, pots, plate
    ];
  };

  const [renderElements, setRenderElements] = useState(() => {
    return renderAll();
  });


  return (
          <div className="mt-5">
            {renderElements && (
                    <Application width={545} height={250} autostart backgroundColor={0xd87f20}>
                      <GameStage renderElements={renderElements} />
                    </Application>
            )}
          </div>
  );
};

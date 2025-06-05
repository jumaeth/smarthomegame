import {ClickableElement} from "../../objects/ClickableElement.ts";
import {AlphaFilter} from "pixi.js";
import {SpriteRender} from "../SpriteRender.tsx";
export const GameStage = ({ setStage, dimensions, notificationProperties }) => {

  const highlightAlpha = 1.35;

  const goToRecipe = () => {
    setTimeout(() => {
      setStage("recipe");
    }, 0);
  };

  const goToIngredients = () => {
    setTimeout(() => {
      setStage("ingredients");
    }, 0);
  };




  const recipe             = new ClickableElement("recipe", 0.14, dimensions.width*0.13, dimensions.height*0.32, "/cooking-sprites/recipe.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), goToRecipe);
  const notification       = new ClickableElement("recipeNotification", 0.08, notificationProperties.x, notificationProperties.y, "/cooking-sprites/notification.png", 100, 100, new AlphaFilter(), null);
  const ingredients        = new ClickableElement("ingredients", 0.125, dimensions.width*0.13, dimensions.height*0.7, "/cooking-sprites/ingredients.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), goToIngredients);
  const herd               = new ClickableElement("herd", 0.2125, dimensions.width*0.49, dimensions.height*0.5, "/cooking-sprites/herd.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), null);
  const pots               = new ClickableElement("pots", 0.15, dimensions.width*0.85, dimensions.height*0.32, "/cooking-sprites/pots.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), () => setStage("cook"));
  const plate              = new ClickableElement("plate", 0.12, dimensions.width*0.85, dimensions.height*0.73, "/cooking-sprites/plate.png", 100, 100, new AlphaFilter({ alpha: highlightAlpha }), () => setStage("serve"));

  const renderElements = [
    recipe,
    ingredients,
    herd,
    pots,
    plate,
    ...(notificationProperties.alpha !== 0 ? [notification] : [])
  ];



  return (
          <>
              {renderElements.map((object) => (
                   <SpriteRender key={object.id} content={object} />
              ))}
          </>
);
};
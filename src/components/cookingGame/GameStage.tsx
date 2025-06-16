import {ClickableElement} from "../../objects/ClickableElement.ts";
import {AlphaFilter} from "pixi.js";
import {SpriteRender} from "../SpriteRender.tsx";
export const GameStage = ({ setStage, notificationProperties }) => {

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

  const recipe             = new ClickableElement("recipe", 0.14, 75, 80, "/src/assets/cooking-sprites/recipe.png", 100, 100, new AlphaFilter(highlightAlpha), goToRecipe);
  const notification       = new ClickableElement("recipeNotification", 0.08, notificationProperties.x, notificationProperties.y, "/src/assets/cooking-sprites/notification.png", 100, 100, new AlphaFilter(), null);
  const ingredients        = new ClickableElement("ingredients", 0.125, 75, 235, "/src/assets/cooking-sprites/ingredients.png", 100, 100, new AlphaFilter(highlightAlpha), goToIngredients);
  const herd               = new ClickableElement("herd", 0.2125, 270, 165, "/src/assets/cooking-sprites/herd.png", 100, 100, new AlphaFilter(highlightAlpha), null);
  const pots               = new ClickableElement("pots", 0.15, 465, 85, "/src/assets/cooking-sprites/pots.png", 100, 100, new AlphaFilter(highlightAlpha), () => setStage("cook"));
  const plate              = new ClickableElement("plate", 0.12, 465, 245, "/src/assets/cooking-sprites/plate.png", 100, 100, new AlphaFilter(highlightAlpha), () => setStage("serve"));

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
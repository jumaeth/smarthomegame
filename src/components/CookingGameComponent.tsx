import {ClickableElement} from "../objects/ClickableElement.ts";
import {SpriteRender} from "./SpriteRender.tsx";
import { Application } from '@pixi/react';
import {AlphaFilter} from "pixi.js";
import {useRef} from "react";
import {RenderElement} from "../objects/RenderElement.ts";




export const CookingGameComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderElements: ClickableElement[] = [
    new RenderElement("element0", 0.3, 300, 100, "/cooking-sprites/counter.png", 100, 100),
    new ClickableElement("element1", 0.14, 75, 70, "/cooking-sprites/recipe.png", 100, 100, new AlphaFilter({alpha:1.35})),
    new ClickableElement("element2", 0.125, 70, 185, "/cooking-sprites/ingredients.png", 100, 100, new AlphaFilter({alpha:1.35})),
    new ClickableElement("element3", 0.2125, 265, 120, "/cooking-sprites/herd.png", 100, 100, new AlphaFilter({alpha:1.5})),
    new ClickableElement("element4", 0.15, 465, 70, "/cooking-sprites/pots.png", 100, 100, new AlphaFilter({alpha:1.35})),
    new ClickableElement("element5", 0.12, 465, 190, "/cooking-sprites/plate.png", 100, 100, new AlphaFilter({alpha:1.35}))
  ];


  return (
          <div ref={containerRef}>
            <Application
                  width={545}
                  height={250}
                  backgroundColor={0xd87f20}>
            {renderElements.map((object: ClickableElement) =>
                    <SpriteRender content={object}/>)}
            </Application>
          </div>
  );
};

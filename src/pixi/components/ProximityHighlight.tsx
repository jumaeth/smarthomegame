import {TILE_SIZE} from "@/pixi/constants/world-settings";
import {PropsWithChildren, useRef} from "react";
import {Container as PixiContainer, Graphics as PixiGraphics} from "pixi.js"
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {Container, useTick} from "@pixi/react";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {getHighlightPosition} from "@/utils/highlightPositions.ts";


interface ProximityHighlightProps {
    interactiveElements?: InteractivePixiElement[];
}
export const ProximityHighlight = ({
                                       interactiveElements,
                                     }: PropsWithChildren<ProximityHighlightProps>) => {

    const pos = useCharacterPosition();
    const graphicRef = useRef<PixiContainer|null>(null);


    const checkForProximity = () => {
      if (!pos) {
        return null;
      }

      const targetX = pos.x / TILE_SIZE;
      const targetY = pos.y / TILE_SIZE;

      const interactiveElement = interactiveElements?.find((element: InteractivePixiElement) => {
        const elementLeft = element.x-1;
        const elementRight = element.x + (element.width ) ;
        const elementTop = element.y-1;
        const elementBottom = element.y + (element.height) ;
        return (
                targetX >= elementLeft &&
                targetX <= elementRight &&
                targetY >= elementTop &&
                targetY <= elementBottom
        );
      });

      if (interactiveElement)return interactiveElement;
      else return null;
    }
      const checkForHighlight = () => {
      if (!pos) {
        return null;
      }

      const interactive = checkForProximity();

      const graphic = graphicRef.current;
      if(!graphic)return;
      const g = new PixiGraphics
      if (interactive) {

        const rect = getHighlightPosition(interactive);

        g.lineStyle(1, 0xFFFF00, 0.5);
        g.drawRoundedRect(rect.x, rect.y, rect.width* TILE_SIZE, rect.height* TILE_SIZE, rect.radius);

      }else{
        if(!graphic)return;
        g.clear();
      }

      graphic.removeChildren();
      graphic.addChild(g);

    }

    useTick(() => {checkForHighlight();});

    return (<Container ref={graphicRef}/>);
}
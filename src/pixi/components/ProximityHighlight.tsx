import {TILE_SIZE} from "@/pixi/constants/world-settings";
import {PropsWithChildren, useEffect, useRef} from "react";
import {Container as PixiContainer, Graphics as PixiGraphics} from "pixi.js"
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {Container} from "@pixi/react";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {getHighlightPosition} from "@/utils/highlightPositions.ts";
import {getNearbyInteractiveElement} from "@/utils/character/proximity.ts";
import { pixelToTile } from "@/utils/coords";

interface ProximityHighlightProps {
  interactiveElements?: InteractivePixiElement[];
}

export const ProximityHighlight = ({
                                     interactiveElements,
                                   }: PropsWithChildren<ProximityHighlightProps>) => {
  const pos = useCharacterPosition();
  const graphicRef = useRef<PixiContainer | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!pos) return;

    // Only check if the position actually changed
    if (
            lastPos.current &&
            lastPos.current.x === pos.x &&
            lastPos.current.y === pos.y
    ) {
      return;
    }

    lastPos.current = pos;

    const playerTile = pixelToTile(pos.x, pos.y);
    const interactive = getNearbyInteractiveElement(playerTile, interactiveElements);
    console.log({ posPixels: pos, playerTile, interactive });
    console.log(interactive)

    const graphic = graphicRef.current;
    if (!graphic) return;

    const g = new PixiGraphics();

    if (interactive) {
      const rect = getHighlightPosition(interactive);
      g.lineStyle(1, 0xffff00, 0.5);
      g.drawRoundedRect(rect.x, rect.y, rect.width * TILE_SIZE, rect.height * TILE_SIZE, rect.radius);
    } else {
      g.clear();
    }

    graphic.removeChildren();
    graphic.addChild(g);
  }, [pos, interactiveElements]);

  return <Container ref={graphicRef} />;
}
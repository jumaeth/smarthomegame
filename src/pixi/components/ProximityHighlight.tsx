import {TILE_SIZE} from "@/pixi/constants/world-settings";
import {PropsWithChildren, useRef} from "react";
import {Container as PixiContainer, Graphics as PixiGraphics} from "pixi.js"
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {Container, useTick} from "@pixi/react";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {getHighlightPosition2} from "@/utils/highlightPositions.ts";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {getNearbyInteractiveElement} from "@/utils/character/proximity.ts";
import { pixelToTile } from "@/utils/coords";

interface ProximityHighlightProps {
    interactiveElements?: InteractivePixiElement[];
    windowWidth: number;
    windowHeight: number;
}

export const ProximityHighlight = ({
                                     interactiveElements,
                                   }: PropsWithChildren<ProximityHighlightProps>) => {
  const pos = useCharacterPosition();
  const graphicRef = useRef<PixiContainer | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [interactive, setInteractive] = useState<InteractivePixiElement | null>(null);

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

    const graphic = graphicRef.current;
    if (!graphic) return;

    const g = new PixiGraphics();

    if (interactive) {
      setInteractive(interactive)
      //const rect = getHighlightPosition(interactive);
      //g.lineStyle(1, 0xffff00, 0.5);
      //g.drawRoundedRect(rect.x, rect.y, rect.width * TILE_SIZE, rect.height * TILE_SIZE, rect.radius);
    } else {
      g.clear();
    }

    graphic.removeChildren();
    graphic.addChild(g);
  }, [pos, interactiveElements]);

  const getPosition = () => {return interactive ? {x: interactive.x, y: interactive.y} : {x: 0, y: 0}}

  return (
          <>
            <Container ref={graphicRef}/>
            { getPosition().x != 0 && interactive && getHighlightPosition2(interactive, getPosition())}
          </>
  );
}